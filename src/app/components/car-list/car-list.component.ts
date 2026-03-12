import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatabaseService } from '../../services/database/database.service';
import { CarItemComponent } from './car-item/car-item.component';
import { Car } from '../../interfaces/car-interface';
import { TranslatePipe } from '../../common/pipes/translate.pipe';

@Component({
  selector: 'app-car-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, CarItemComponent, TranslatePipe],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss',
})
export class CarListComponent implements OnInit {
  readonly cars = signal<Car[]>([]);
  readonly hasMoreCars = signal(true);
  readonly isLoading = signal(false);

  private page = 1;
  private readonly pageSize = 5;
  private readonly databaseService = inject(DatabaseService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.databaseService
      .getCarsPaginated(this.page, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newCars => {
        if (newCars.length > 0) {
          this.cars.update(existing => [...existing, ...newCars]);
          this.page++;
        }
        if (newCars.length < this.pageSize) {
          this.hasMoreCars.set(false);
        }
        this.isLoading.set(false);
      });
  }
}
