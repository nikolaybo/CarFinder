import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CarViewComponent } from './car-view.component';
import { CarService } from '../../../services/car/car.service';
import { CarRepository } from '../../../services/repositories/car.repository';
import { TranslationService } from '../../../services/translation/translation.service';
import type { Car } from '../../../interfaces/car-interface';
import {
  createMockTranslationService,
  createCarRepositorySpy,
  mockCar,
} from '../../../../testing/test-helpers';

describe('CarViewComponent', () => {
  let component: CarViewComponent;
  let fixture: ComponentFixture<CarViewComponent>;
  let carRepoSpy: jasmine.SpyObj<CarRepository>;
  let carServiceSpy: jasmine.SpyObj<CarService>;
  let router: Router;

  function setupTestBed(paramId: string, cachedCar: any = null) {
    carRepoSpy = createCarRepositorySpy();
    carRepoSpy.getCarById.and.returnValue(of(mockCar));

    carServiceSpy = jasmine.createSpyObj('CarService', ['setCar'], {
      selectedCar: signal<Car | null>(cachedCar),
    });

    TestBed.configureTestingModule({
      imports: [CarViewComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: CarRepository, useValue: carRepoSpy },
        { provide: CarService, useValue: carServiceSpy },
        { provide: TranslationService, useValue: createMockTranslationService() },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: paramId })),
          },
        },
      ],
    });
  }

  it('should create', fakeAsync(async () => {
    setupTestBed('car-1');
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('uses cached car from CarService when id matches', fakeAsync(async () => {
    setupTestBed('car-1', mockCar); // cached car has id 'car-1'
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(carRepoSpy.getCarById).not.toHaveBeenCalled();
    expect(component.car()).toEqual(mockCar);
  }));

  it('fetches car from DB when cache is empty', fakeAsync(async () => {
    setupTestBed('car-1', null); // no cached car
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(carRepoSpy.getCarById).toHaveBeenCalledWith('car-1');
    expect(component.car()).toEqual(mockCar);
  }));

  it('fetches car from DB when cached car id does not match route id', fakeAsync(async () => {
    const differentCar = { ...mockCar, id: 'car-99' };
    setupTestBed('car-1', differentCar); // cache has different id
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(carRepoSpy.getCarById).toHaveBeenCalledWith('car-1');
  }));

  it('navigates to / when car is not found', fakeAsync(async () => {
    setupTestBed('nonexistent', null);
    carRepoSpy.getCarById.and.returnValue(of(null));
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarViewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('stores fetched car in CarService cache', fakeAsync(async () => {
    setupTestBed('car-1', null);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(carServiceSpy.setCar).toHaveBeenCalledWith(mockCar);
  }));
});
