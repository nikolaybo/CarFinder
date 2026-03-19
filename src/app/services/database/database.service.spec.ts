import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from './database.service';
import { CarRepository } from '../repositories/car.repository';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { mockCar } from '../../../testing/test-helpers';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let carRepoSpy: jasmine.SpyObj<CarRepository>;
  let favoriteRepoSpy: jasmine.SpyObj<FavoriteRepository>;

  beforeEach(() => {
    carRepoSpy = jasmine.createSpyObj('CarRepository', [
      'getCarsPaginated', 'getCarById', 'getCarsByIds', 'searchCars',
    ]);
    favoriteRepoSpy = jasmine.createSpyObj('FavoriteRepository', [
      'addFavorite', 'removeFavorite', 'getUserFavorites',
    ]);

    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        { provide: CarRepository, useValue: carRepoSpy },
        { provide: FavoriteRepository, useValue: favoriteRepoSpy },
      ],
    });
    service = TestBed.inject(DatabaseService);
  });

  it('getCarsPaginated() delegates to CarRepository', async () => {
    carRepoSpy.getCarsPaginated.and.returnValue(of([mockCar]));
    const result = await firstValueFrom(service.getCarsPaginated(1, 5));
    expect(carRepoSpy.getCarsPaginated).toHaveBeenCalledWith(1, 5);
    expect(result).toEqual([mockCar]);
  });

  it('getCarById() delegates to CarRepository', async () => {
    carRepoSpy.getCarById.and.returnValue(of(mockCar));
    const result = await firstValueFrom(service.getCarById('car-1'));
    expect(carRepoSpy.getCarById).toHaveBeenCalledWith('car-1');
    expect(result).toEqual(mockCar);
  });

  it('getCarsByIds() delegates to CarRepository', async () => {
    carRepoSpy.getCarsByIds.and.returnValue(of([mockCar]));
    const result = await firstValueFrom(service.getCarsByIds(['car-1']));
    expect(carRepoSpy.getCarsByIds).toHaveBeenCalledWith(['car-1']);
    expect(result).toEqual([mockCar]);
  });

  it('searchCars() delegates to CarRepository', async () => {
    carRepoSpy.searchCars.and.returnValue(of([mockCar]));
    const result = await firstValueFrom(service.searchCars('Tesla'));
    expect(carRepoSpy.searchCars).toHaveBeenCalledWith('Tesla');
    expect(result).toEqual([mockCar]);
  });

  it('addFavorite() delegates to FavoriteRepository', async () => {
    favoriteRepoSpy.addFavorite.and.returnValue(of(void 0));
    await firstValueFrom(service.addFavorite('user-1', 'car-1'));
    expect(favoriteRepoSpy.addFavorite).toHaveBeenCalledWith('user-1', 'car-1');
  });

  it('removeFavorite() delegates to FavoriteRepository', async () => {
    favoriteRepoSpy.removeFavorite.and.returnValue(of(void 0));
    await firstValueFrom(service.removeFavorite('user-1', 'car-1'));
    expect(favoriteRepoSpy.removeFavorite).toHaveBeenCalledWith('user-1', 'car-1');
  });

  it('getUserFavorites() delegates to FavoriteRepository', async () => {
    favoriteRepoSpy.getUserFavorites.and.returnValue(of(['car-1', 'car-2']));
    const result = await firstValueFrom(service.getUserFavorites('user-1'));
    expect(favoriteRepoSpy.getUserFavorites).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(['car-1', 'car-2']);
  });
});
