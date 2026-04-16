import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CarRepository } from '../repositories/car.repository';
import type { Car } from '../../interfaces/car-interface';

/**
 * Scoped store for the car listing page. Provided by CarListComponent so each
 * mount gets its own isolated pagination state. Injecting CarRepository keeps
 * the fetch logic out of the component and makes it independently testable.
 */
@Injectable()
export class CarListStore {
  private readonly carRepo = inject(CarRepository);
  private readonly destroyRef = inject(DestroyRef);

  private currentPage = 1;
  private readonly pageSize = 5;

  readonly cars = signal<Car[]>([]);
  readonly hasMore = signal(true);
  readonly isLoading = signal(false);

  /**
   * Fetches the next page of cars from Supabase and appends them to `cars`.
   * Concurrent calls are ignored while a request is in flight. Sets `hasMore`
   * to false when the returned batch is shorter than `pageSize`, signalling
   * that the listing has reached the last available record.
   *
   * @returns void — results are written directly into the `cars` signal.
   */
  loadNextPage(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.carRepo
      .getCarsPaginated(this.currentPage, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: fetchedCars => {
          if (fetchedCars.length > 0) {
            this.cars.update(currentCars => [...currentCars, ...fetchedCars]);
            this.currentPage++;
          }
          if (fetchedCars.length < this.pageSize) {
            this.hasMore.set(false);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.hasMore.set(false);
          this.isLoading.set(false);
        },
      });
  }
}
