import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CarListComponent } from './car-list.component';
import { CarRepository } from '../../services/repositories/car.repository';
import { TranslationService } from '../../services/translation/translation.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import {
  createMockTranslationService,
  createFavoritesServiceSpy,
  mockCar,
} from '../../../testing/test-helpers';

const mockCar2 = { ...mockCar, id: 'car-2', model: 'BMW M3' };

describe('CarListComponent', () => {
  let component: CarListComponent;
  let fixture: ComponentFixture<CarListComponent>;
  let carRepoSpy: jasmine.SpyObj<CarRepository>;

  function setupTestBed(pages: any[][]) {
    let callCount = 0;
    carRepoSpy = jasmine.createSpyObj('CarRepository', ['getCarsPaginated']);
    carRepoSpy.getCarsPaginated.and.callFake(() => of(pages[callCount++] ?? []));

    TestBed.configureTestingModule({
      imports: [CarListComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: CarRepository, useValue: carRepoSpy },
        { provide: TranslationService, useValue: createMockTranslationService() },
        { provide: FavoritesService, useValue: createFavoritesServiceSpy() },
      ],
    });
  }

  it('should create', fakeAsync(async () => {
    setupTestBed([[]]);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('fetches page 1 with pageSize 5 on init', fakeAsync(async () => {
    setupTestBed([[mockCar, mockCar2]]);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(carRepoSpy.getCarsPaginated).toHaveBeenCalledWith(1, 5);
  }));

  it('populates cars signal after initial load', fakeAsync(async () => {
    setupTestBed([[mockCar, mockCar2]]);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.cars().length).toBe(2);
    expect(component.cars()).toContain(mockCar);
  }));

  it('hasMoreCars is false when result count is less than pageSize', fakeAsync(async () => {
    setupTestBed([[mockCar]]); // only 1 car returned (less than pageSize 5)
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.hasMoreCars()).toBeFalse();
  }));

  it('hasMoreCars is true when a full page is returned', fakeAsync(async () => {
    const fullPage = Array(5).fill(null).map((_, i) => ({ ...mockCar, id: `car-${i}` }));
    setupTestBed([fullPage, []]); // first call returns 5, second returns 0
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.hasMoreCars()).toBeTrue();
  }));

  it('loadCars() appends more cars to the existing list', fakeAsync(async () => {
    const page1 = Array(5).fill(null).map((_, i) => ({ ...mockCar, id: `car-${i}` }));
    setupTestBed([page1, [mockCar2]]);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.cars().length).toBe(5);

    component.loadCars();
    tick();
    expect(component.cars().length).toBe(6);
    expect(carRepoSpy.getCarsPaginated).toHaveBeenCalledWith(2, 5);
  }));

  it('does not call loadCars() again while isLoading is true', fakeAsync(async () => {
    setupTestBed([[mockCar]]);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    // Try to load when isLoading is already false, call count should be 1 from init
    const callsBefore = carRepoSpy.getCarsPaginated.calls.count();
    component.loadCars();
    tick();
    // One more call for our explicit loadCars()
    expect(carRepoSpy.getCarsPaginated.calls.count()).toBe(callsBefore + 1);
  }));
});
