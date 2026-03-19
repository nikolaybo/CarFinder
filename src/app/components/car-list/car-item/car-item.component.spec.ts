import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { CarItemComponent } from './car-item.component';
import { CarService } from '../../../services/car/car.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { TranslationService } from '../../../services/translation/translation.service';
import { createMockTranslationService, mockCar } from '../../../../testing/test-helpers';

describe('CarItemComponent', () => {
  let component: CarItemComponent;
  let fixture: ComponentFixture<CarItemComponent>;
  let carServiceSpy: jasmine.SpyObj<CarService>;
  let favoritesSpy: jasmine.SpyObj<FavoritesService>;
  let router: Router;

  beforeEach(async () => {
    carServiceSpy = jasmine.createSpyObj('CarService', ['setCar']);
    favoritesSpy = jasmine.createSpyObj('FavoritesService', ['isFavorite', 'toggle'], {
      favoriteIds: signal(new Set<string>()),
    });
    favoritesSpy.isFavorite.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [CarItemComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: CarService, useValue: carServiceSpy },
        { provide: FavoritesService, useValue: favoritesSpy },
        { provide: TranslationService, useValue: createMockTranslationService() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('car', mockCar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives car input correctly', () => {
    expect(component.car()).toEqual(mockCar);
  });

  it('showFavoriteButton defaults to true', () => {
    expect(component.showFavoriteButton()).toBeTrue();
  });

  it('isFavorite computed reflects FavoritesService.isFavorite()', () => {
    favoritesSpy.isFavorite.and.returnValue(true);
    fixture.componentRef.setInput('car', { ...mockCar, id: 'car-fav' });
    fixture.detectChanges();
    expect(component.isFavorite()).toBeTrue();
  });

  describe('goToCarView()', () => {
    it('calls CarService.setCar() with the current car', fakeAsync(() => {
      spyOn(router, 'navigate');
      component.goToCarView();
      tick();
      expect(carServiceSpy.setCar).toHaveBeenCalledWith(mockCar);
    }));

    it('navigates to /car-view/:id', fakeAsync(() => {
      spyOn(router, 'navigate');
      component.goToCarView();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/car-view', mockCar.id]);
    }));
  });

  describe('toggleFavorite()', () => {
    it('calls FavoritesService.toggle() with the car id', () => {
      component.toggleFavorite();
      expect(favoritesSpy.toggle).toHaveBeenCalledWith(mockCar.id);
    });
  });
});
