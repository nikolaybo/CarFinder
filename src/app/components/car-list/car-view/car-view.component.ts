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
import { DatabaseService } from '../../../services/database/database.service';
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
  private readonly dbService = inject(DatabaseService);
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.activeRoute.paramMap.pipe(
      switchMap(params => {
        const carId = params.get('id');
        if (!carId) return of(null);

        const cached = this.carService.getCar()();
        if (cached?.id === carId) return of(cached);

        return this.dbService.getCarById(carId);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(car => {
      if (!car) {
        this.router.navigate(['/']);
        return;
      }
      this.car.set(car);
      this.carService.setCar(car);
    });
  }
}
