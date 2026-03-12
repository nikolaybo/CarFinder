import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CarService } from '../../../services/car/car.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import type { Car } from '../../../interfaces/car-interface';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';

@Component({
  selector: 'app-car-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, DecimalPipe, TranslatePipe],
  templateUrl: './car-item.component.html',
  styleUrl: './car-item.component.scss',
})
export class CarItemComponent {
  readonly car = input.required<Car>();
  readonly showFavoriteButton = input(true);
  readonly isFavorite = computed(() => this.favoritesService.isFavorite(this.car().id));

  private readonly router = inject(Router);
  private readonly carService = inject(CarService);
  private readonly favoritesService = inject(FavoritesService);

  goToCarView(): void {
    this.carService.setCar(this.car());
    this.router.navigate(['/car-view', this.car().id]);
  }

  toggleFavorite(): void {
    this.favoritesService.toggle(this.car().id);
  }
}
