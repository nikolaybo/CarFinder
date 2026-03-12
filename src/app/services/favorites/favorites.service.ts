import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly db = inject(DatabaseService);
  private readonly auth = inject(AuthService);

  private readonly _ids = signal<Set<string>>(new Set());
  readonly favoriteIds = this._ids.asReadonly();

  private userId: string | null = null;

  constructor() {
    this.auth.currentUser$.pipe(
      switchMap(user => {
        this.userId = user?.id ?? null;
        if (!this.userId) {
          this._ids.set(new Set());
          return of([] as string[]);
        }
        return this.db.getUserFavorites(this.userId);
      }),
      takeUntilDestroyed()
    ).subscribe(ids => this._ids.set(new Set(ids)));
  }

  isFavorite(carId: string): boolean {
    return this._ids().has(carId);
  }

  toggle(carId: string): void {
    if (!this.userId) return;
    const was = this.isFavorite(carId);
    const action$ = was
      ? this.db.removeFavorite(this.userId, carId)
      : this.db.addFavorite(this.userId, carId);

    action$.subscribe(() => {
      this._ids.update(set => {
        const next = new Set(set);
        was ? next.delete(carId) : next.add(carId);
        return next;
      });
    });
  }
}
