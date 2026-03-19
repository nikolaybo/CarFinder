import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DecimalPipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CarService } from '../../../services/car/car.service';
import { CarRepository } from '../../../services/repositories/car.repository';
import { Car } from '../../../interfaces/car-interface';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';

@Component({
  selector: 'app-car-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, LowerCasePipe, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './car-view.component.html',
  styleUrl: './car-view.component.scss',
})
export class CarViewComponent implements OnInit {
  readonly car = signal<Car | null>(null);

  private readonly carService = inject(CarService);
  private readonly carRepo = inject(CarRepository);
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Resolves the car to display from the route :id parameter. Checks CarService's
   * in-memory cache first so navigating back from the detail page is instant.
   * If the cache is stale or empty, fetches from the database. Redirects to the
   * homepage when the car ID is missing or the DB returns nothing.
   */
  ngOnInit(): void {
    this.activeRoute.paramMap.pipe(
      switchMap(routeParams => {
        const carId = routeParams.get('id');
        if (!carId) return of(null);

        const cachedCar = this.carService.selectedCar();
        if (cachedCar?.id === carId) return of(cachedCar);

        return this.carRepo.getCarById(carId);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(resolvedCar => {
      if (!resolvedCar) {
        this.router.navigate(['/']);
        return;
      }
      this.car.set(resolvedCar);
      this.carService.setCar(resolvedCar);
    });
  }
}
