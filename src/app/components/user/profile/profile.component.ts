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
import { DatabaseService } from '../../../services/database/database.service';
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

  private readonly dbService = inject(DatabaseService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading.set(true);

    this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => user?.id ? this.dbService.getUserFavorites(user.id) : of([] as string[])),
      switchMap(ids => ids.length ? this.dbService.getCarsByIds(ids) : of([] as Car[])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(cars => {
      this.favoriteCars.set(cars);
      this.isLoading.set(false);
    });
  }
}
