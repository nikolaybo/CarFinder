import { inject, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SupabaseService } from '../supabase/supabase.service';
import type { Car } from '../../interfaces/car-interface';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
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
        return (data ?? []).map((fav: { car_id: string }) => fav.car_id);
      }),
      catchError(() => of([] as string[]))
    );
  }

  getCarsPaginated(page: number, pageSize: number): Observable<Car[]> {
    const rangeFrom = (page - 1) * pageSize;
    const rangeTo = rangeFrom + pageSize - 1;
    return from(
      this.db
        .from('cars')
        .select('*')
        .order('model', { ascending: true })
        .range(rangeFrom, rangeTo)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Car[];
      }),
      catchError(() => of([] as Car[]))
    );
  }

  getCarById(carId: string): Observable<Car | null> {
    return from(
      this.db.from('cars').select('*').eq('id', carId).single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Car;
      }),
      catchError(() => of(null))
    );
  }

  getCarsByIds(carIds: string[]): Observable<Car[]> {
    if (!carIds.length) return of([]);
    return from(
      this.db.from('cars').select('*').in('id', carIds)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Car[];
      }),
      catchError(() => of([] as Car[]))
    );
  }

  searchCars(query: string): Observable<Car[]> {
    const sanitized = query.trim().substring(0, 100);
    if (!sanitized) return of([]);
    return from(
      this.db
        .from('cars')
        .select('*')
        .or(`model.ilike.%${sanitized}%,type.ilike.%${sanitized}%`)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Car[];
      }),
      catchError(() => of([] as Car[]))
    );
  }
}
