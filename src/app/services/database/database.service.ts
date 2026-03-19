import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarRepository } from '../repositories/car.repository';
import { FavoriteRepository } from '../repositories/favorite.repository';
import type { Car } from '../../interfaces/car-interface';

/**
 * Thin facade that delegates all database operations to the narrower
 * CarRepository and FavoriteRepository. Preserved so that existing
 * specs and call sites can migrate to the repositories incrementally
 * without a big-bang refactor.
 */
@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly carRepo = inject(CarRepository);
  private readonly favoriteRepo = inject(FavoriteRepository);

  addFavorite(userId: string, carId: string): Observable<void> {
    return this.favoriteRepo.addFavorite(userId, carId);
  }

  removeFavorite(userId: string, carId: string): Observable<void> {
    return this.favoriteRepo.removeFavorite(userId, carId);
  }

  getUserFavorites(userId: string): Observable<string[]> {
    return this.favoriteRepo.getUserFavorites(userId);
  }

  getCarsPaginated(page: number, pageSize: number): Observable<Car[]> {
    return this.carRepo.getCarsPaginated(page, pageSize);
  }

  getCarById(carId: string): Observable<Car | null> {
    return this.carRepo.getCarById(carId);
  }

  getCarsByIds(carIds: string[]): Observable<Car[]> {
    return this.carRepo.getCarsByIds(carIds);
  }

  searchCars(query: string): Observable<Car[]> {
    return this.carRepo.searchCars(query);
  }
}
