import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favoriteRepo = inject(FavoriteRepository);
  private readonly auth = inject(AuthService);

  private readonly _savedCarIds = signal<Set<string>>(new Set());
  readonly favoriteIds = this._savedCarIds.asReadonly();

  private loggedInUserId: string | null = null;

  /**
   * Subscribes to auth state for the app lifetime. When a user signs in,
   * fetches their saved car IDs from Supabase and caches them locally so
   * heart-icon state renders without extra round-trips. On sign-out the
   * cache is wiped immediately — stale favorites from the previous session
   * must never bleed into the next user's view.
   */
  constructor() {
    this.auth.currentUser$.pipe(
      switchMap(authenticatedUser => {
        this.loggedInUserId = authenticatedUser?.id ?? null;
        if (!this.loggedInUserId) {
          this._savedCarIds.set(new Set());
          return of([] as string[]);
        }
        return this.favoriteRepo.getUserFavorites(this.loggedInUserId);
      }),
      takeUntilDestroyed()
    ).subscribe(savedCarIds => this._savedCarIds.set(new Set(savedCarIds)));
  }

  isFavorite(carId: string): boolean {
    return this._savedCarIds().has(carId);
  }

  /**
   * Toggles a car's saved status. The Supabase write goes first — the local
   * cache is only flipped on success, so a network error leaves the heart
   * icon in its previous (truthful) state rather than showing a lie.
   */
  toggle(carId: string): void {
    if (!this.loggedInUserId) return;
    const alreadySaved = this.isFavorite(carId);
    const persistChange$ = alreadySaved
      ? this.favoriteRepo.removeFavorite(this.loggedInUserId, carId)
      : this.favoriteRepo.addFavorite(this.loggedInUserId, carId);

    persistChange$.subscribe({
      next: () => {
        this._savedCarIds.update(currentlySaved => {
          const nextSaved = new Set(currentlySaved);
          alreadySaved ? nextSaved.delete(carId) : nextSaved.add(carId);
          return nextSaved;
        });
      },
      error: () => {
        // Network error — leave cache in its previous (truthful) state so
        // the heart icon doesn't lie about what's actually saved in Supabase.
      },
    });
  }
}
