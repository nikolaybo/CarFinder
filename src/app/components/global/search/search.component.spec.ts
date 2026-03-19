import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SearchComponent } from './search.component';
import { CarRepository } from '../../../services/repositories/car.repository';
import { CarService } from '../../../services/car/car.service';
import { TranslationService } from '../../../services/translation/translation.service';
import { createMockTranslationService, mockCar } from '../../../../testing/test-helpers';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let carRepoSpy: jasmine.SpyObj<CarRepository>;
  let carServiceSpy: jasmine.SpyObj<CarService>;
  let router: Router;

  beforeEach(async () => {
    carRepoSpy = jasmine.createSpyObj('CarRepository', ['searchCars']);
    carRepoSpy.searchCars.and.returnValue(of([mockCar]));
    carServiceSpy = jasmine.createSpyObj('CarService', ['setCar']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: CarRepository, useValue: carRepoSpy },
        { provide: CarService, useValue: carServiceSpy },
        { provide: TranslationService, useValue: createMockTranslationService() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchTerm signal starts empty', () => {
    expect(component.searchTerm()).toBe('');
  });

  it('searchResults signal starts empty', () => {
    expect(component.searchResults()).toEqual([]);
  });

  it('onSearch() triggers the search pipeline after debounce', fakeAsync(() => {
    component.searchTerm.set('Tesla');
    component.onSearch();
    tick(300); // debounce
    expect(carRepoSpy.searchCars).toHaveBeenCalledWith('Tesla');
    expect(component.searchResults()).toEqual([mockCar]);
  }));

  it('onSearch() clears results for empty query without calling DB', fakeAsync(() => {
    component.searchTerm.set('');
    component.onSearch();
    tick(300);
    expect(carRepoSpy.searchCars).not.toHaveBeenCalled();
    expect(component.searchResults()).toEqual([]);
  }));

  it('onSearch() clears results for whitespace-only query', fakeAsync(() => {
    component.searchTerm.set('   ');
    component.onSearch();
    tick(300);
    expect(carRepoSpy.searchCars).not.toHaveBeenCalled();
  }));

  describe('goToCarView()', () => {
    it('calls CarService.setCar() with the selected car', () => {
      component.goToCarView(mockCar);
      expect(carServiceSpy.setCar).toHaveBeenCalledWith(mockCar);
    });

    it('navigates to /car-view/:id', fakeAsync(() => {
      spyOn(router, 'navigate');
      component.goToCarView(mockCar);
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/car-view', mockCar.id]);
    }));

    it('clears searchResults after navigation', () => {
      component.searchResults.set([mockCar]);
      component.goToCarView(mockCar);
      expect(component.searchResults()).toEqual([]);
    });

    it('clears searchTerm after navigation', () => {
      component.searchTerm.set('Tesla');
      component.goToCarView(mockCar);
      expect(component.searchTerm()).toBe('');
    });
  });
});
