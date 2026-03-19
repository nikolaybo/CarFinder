import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarListStore } from '../../services/stores/car-list.store';
import { CarItemComponent } from './car-item/car-item.component';
import { TranslatePipe } from '../../common/pipes/translate.pipe';

@Component({
  selector: 'app-car-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, CarItemComponent, TranslatePipe],
  providers: [CarListStore],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss',
})
export class CarListComponent implements OnInit {
  private readonly store = inject(CarListStore);

  readonly cars = this.store.cars;
  readonly hasMoreCars = this.store.hasMore;
  readonly isLoading = this.store.isLoading;

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.store.loadNextPage();
  }
}
