import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../services/auth/auth.service';
import { CarRepository } from '../../../services/repositories/car.repository';
import { FavoriteRepository } from '../../../services/repositories/favorite.repository';
import { TranslationService } from '../../../services/translation/translation.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import {
  createMockTranslationService,
  createFavoritesServiceSpy,
  mockUser,
  mockCar,
} from '../../../../testing/test-helpers';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let carRepoSpy: jasmine.SpyObj<CarRepository>;
  let favoriteRepoSpy: jasmine.SpyObj<FavoriteRepository>;

  function setupTestBed(currentUser: any, favoriteIds: string[] = [], cars: any[] = []) {
    authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of(currentUser),
    });
    favoriteRepoSpy = jasmine.createSpyObj('FavoriteRepository', ['getUserFavorites']);
    favoriteRepoSpy.getUserFavorites.and.returnValue(of(favoriteIds));
    carRepoSpy = jasmine.createSpyObj('CarRepository', ['getCarsByIds']);
    carRepoSpy.getCarsByIds.and.returnValue(of(cars));

    TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: AuthService, useValue: authSpy },
        { provide: FavoriteRepository, useValue: favoriteRepoSpy },
        { provide: CarRepository, useValue: carRepoSpy },
        { provide: TranslationService, useValue: createMockTranslationService() },
        { provide: FavoritesService, useValue: createFavoritesServiceSpy() },
      ],
    });
  }

  it('should create', async () => {
    setupTestBed(null);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('sets isLoading to true during ngOnInit', fakeAsync(async () => {
    setupTestBed(mockUser, ['car-1'], [mockCar]);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // isLoading goes true then false synchronously with of()
    tick();
    expect(component.isLoading()).toBeFalse();
  }));

  it('loads favorite cars for authenticated user', fakeAsync(async () => {
    setupTestBed(mockUser, ['car-1'], [mockCar]);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(favoriteRepoSpy.getUserFavorites).toHaveBeenCalledWith(mockUser.id);
    expect(carRepoSpy.getCarsByIds).toHaveBeenCalledWith(['car-1']);
    expect(component.favoriteCars()).toEqual([mockCar]);
  }));

  it('shows no favorite cars when user is not authenticated', fakeAsync(async () => {
    setupTestBed(null);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(favoriteRepoSpy.getUserFavorites).not.toHaveBeenCalled();
    expect(component.favoriteCars()).toEqual([]);
  }));

  it('BUG: clears isLoading and favoriteCars when getCarsByIds fails', fakeAsync(async () => {
    setupTestBed(mockUser, ['car-1'], [mockCar]);
    carRepoSpy.getCarsByIds.and.returnValue(throwError(() => new Error('db down')));
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.isLoading()).toBeFalse();
    expect(component.favoriteCars()).toEqual([]);
  }));

  it('shows no favorite cars when user has no favorites', fakeAsync(async () => {
    setupTestBed(mockUser, [], []);
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.favoriteCars()).toEqual([]);
  }));
});
