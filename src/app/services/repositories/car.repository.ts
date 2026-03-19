import { inject, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SupabaseService } from '../supabase/supabase.service';
import type { Car } from '../../interfaces/car-interface';

@Injectable({ providedIn: 'root' })
export class CarRepository {
  private readonly supabase = inject(SupabaseService);

  private get db() {
    return this.supabase.client;
  }

  /**
   * Fetches one page of cars ordered alphabetically by model name.
   * Pages are 1-indexed; the Supabase range is converted to 0-indexed offsets
   * before the request. Returns an empty array on any DB error so the listing
   * page degrades gracefully rather than breaking entirely.
   */
  getCarsPaginated(page: number, pageSize: number): Observable<Car[]> {
    const rangeStart = (page - 1) * pageSize;
    const rangeEnd = rangeStart + pageSize - 1;
    return from(
      this.db
        .from('cars')
        .select('*')
        .order('model', { ascending: true })
        .range(rangeStart, rangeEnd)
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

  /**
   * Full-text search across car model and type using a case-insensitive ILIKE
   * match on both columns. The raw query is trimmed and capped at 100 characters
   * to prevent excessively large payloads from reaching the database.
   */
  searchCars(query: string): Observable<Car[]> {
    const cleanQuery = query.trim().substring(0, 100);
    if (!cleanQuery) return of([]);
    return from(
      this.db
        .from('cars')
        .select('*')
        .or(`model.ilike.%${cleanQuery}%,type.ilike.%${cleanQuery}%`)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Car[];
      }),
      catchError(() => of([] as Car[]))
    );
  }
}
