import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarRepository } from '../../../services/repositories/car.repository';
import { FavoriteRepository } from '../../../services/repositories/favorite.repository';
import { AuthService } from '../../../services/auth/auth.service';
import { CarItemComponent } from '../../car-list/car-item/car-item.component';
import { Car } from '../../../interfaces/car-interface';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarItemComponent, RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  readonly favoriteCars = signal<Car[]>([]);
  readonly isLoading = signal(false);

  private readonly carRepo = inject(CarRepository);
  private readonly favoriteRepo = inject(FavoriteRepository);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Loads the current user's favourite cars in two sequential DB calls:
   * first retrieves the list of saved car IDs, then fetches the full car
   * records for those IDs. Skips both calls and shows an empty state if
   * the user is not authenticated or has no saved favourites.
   */
  ngOnInit(): void {
    this.isLoading.set(true);

    this.authService.currentUser$.pipe(
      take(1),
      switchMap(authenticatedUser =>
        authenticatedUser?.id
          ? this.favoriteRepo.getUserFavorites(authenticatedUser.id)
          : of([] as string[])
      ),
      switchMap(favoriteCarIds =>
        favoriteCarIds.length ? this.carRepo.getCarsByIds(favoriteCarIds) : of([] as Car[])
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(favoritedCars => {
      this.favoriteCars.set(favoritedCars);
      this.isLoading.set(false);
    });
  }
}
