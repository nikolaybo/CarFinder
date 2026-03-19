import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { FavoritesService } from './favorites.service';
import { AuthService } from '../auth/auth.service';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { mockUser } from '../../../testing/test-helpers';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let favoriteRepoSpy: jasmine.SpyObj<FavoriteRepository>;
  let currentUser$: Subject<any>;

  function setup() {
    currentUser$ = new Subject<any>();
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: currentUser$.asObservable(),
    });
    favoriteRepoSpy = jasmine.createSpyObj('FavoriteRepository', [
      'getUserFavorites',
      'addFavorite',
      'removeFavorite',
    ]);
    favoriteRepoSpy.getUserFavorites.and.returnValue(of(['car-1', 'car-2']));
    favoriteRepoSpy.addFavorite.and.returnValue(of(void 0));
    favoriteRepoSpy.removeFavorite.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        { provide: AuthService, useValue: authSpy },
        { provide: FavoriteRepository, useValue: favoriteRepoSpy },
      ],
    });
    service = TestBed.inject(FavoritesService);
  }

  beforeEach(() => setup());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('favoriteIds is empty when no user is logged in', fakeAsync(() => {
    currentUser$.next(null);
    tick();
    expect(service.favoriteIds().size).toBe(0);
  }));

  it('loads favorites from DB when user emits', fakeAsync(() => {
    currentUser$.next(mockUser);
    tick();
    expect(favoriteRepoSpy.getUserFavorites).toHaveBeenCalledWith(mockUser.id);
    expect(service.favoriteIds().has('car-1')).toBeTrue();
    expect(service.favoriteIds().has('car-2')).toBeTrue();
  }));

  it('isFavorite() returns true for a loaded favorite', fakeAsync(() => {
    currentUser$.next(mockUser);
    tick();
    expect(service.isFavorite('car-1')).toBeTrue();
  }));

  it('isFavorite() returns false for an unknown car', fakeAsync(() => {
    currentUser$.next(mockUser);
    tick();
    expect(service.isFavorite('unknown-car')).toBeFalse();
  }));

  it('toggle() adds a car to favorites when it is not yet a favorite', fakeAsync(() => {
    currentUser$.next(mockUser);
    tick();
    service.toggle('car-3');
    tick();
    expect(favoriteRepoSpy.addFavorite).toHaveBeenCalledWith(mockUser.id, 'car-3');
    expect(service.isFavorite('car-3')).toBeTrue();
  }));

  it('toggle() removes a car from favorites when it is already a favorite', fakeAsync(() => {
    currentUser$.next(mockUser);
    tick();
    service.toggle('car-1');
    tick();
    expect(favoriteRepoSpy.removeFavorite).toHaveBeenCalledWith(mockUser.id, 'car-1');
    expect(service.isFavorite('car-1')).toBeFalse();
  }));

  it('toggle() does nothing when no user is logged in', fakeAsync(() => {
    currentUser$.next(null);
    tick();
    service.toggle('car-1');
    tick();
    expect(favoriteRepoSpy.addFavorite).not.toHaveBeenCalled();
    expect(favoriteRepoSpy.removeFavorite).not.toHaveBeenCalled();
  }));

  it('clears favorites when user logs out', fakeAsync(() => {
    currentUser$.next(mockUser);
    tick();
    expect(service.favoriteIds().size).toBe(2);

    currentUser$.next(null);
    tick();
    expect(service.favoriteIds().size).toBe(0);
  }));
});
