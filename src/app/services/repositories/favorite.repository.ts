import { inject, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class FavoriteRepository {
  private readonly supabase = inject(SupabaseService);

  private get db() {
    return this.supabase.client;
  }

  addFavorite(userId: string, carId: string): Observable<void> {
    return from(
      this.db.from('favorites').insert([{ user_id: userId, car_id: carId }])
    ).pipe(
      map(({ error }) => { if (error) throw error; })
    );
  }

  removeFavorite(userId: string, carId: string): Observable<void> {
    return from(
      this.db.from('favorites').delete().eq('user_id', userId).eq('car_id', carId)
    ).pipe(
      map(({ error }) => { if (error) throw error; })
    );
  }

  getUserFavorites(userId: string): Observable<string[]> {
    return from(
      this.db.from('favorites').select('car_id').eq('user_id', userId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map((row: { car_id: string }) => row.car_id);
      }),
      catchError(() => of([] as string[]))
    );
  }
}
