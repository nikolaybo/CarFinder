import { signal } from '@angular/core';
import { ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Car } from '../app/interfaces/car-interface';
import type { Locale } from '../app/services/translation/translation.service';

export const mockCar: Car = {
  id: 'car-1',
  model: 'Tesla Model S',
  type: 'Sedan',
  fuel_consumption: 0,
  price: 79990,
  discounted_price: 74990,
  gearbox: 'Auto',
  image: 'tesla.jpg',
  seats: 5,
};

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '',
};

export function createMockTranslationService() {
  return {
    locale: signal<Locale>('en'),
    t: (key: string) => key,
    setLocale: jasmine.createSpy('setLocale'),
  };
}

export function createAuthServiceSpy() {
  const subject = new ReplaySubject<any>(1);
  const spy = jasmine.createSpyObj('AuthService', ['register', 'logIn', 'logOut'], {
    user$: subject.asObservable(),
    currentUser$: subject.asObservable().pipe(map((r: any) => r?.data?.user ?? null)),
  });
  spy.logIn.and.returnValue(of({ data: { user: mockUser, session: null }, error: null }));
  spy.logOut.and.returnValue(of({ error: null }));
  spy.register.and.returnValue(of({ data: { user: mockUser, session: null }, error: null }));
  return { spy, subject };
}

export function createDatabaseServiceSpy() {
  const spy = jasmine.createSpyObj('DatabaseService', [
    'addFavorite',
    'removeFavorite',
    'getUserFavorites',
    'getCarsPaginated',
    'getCarById',
    'getCarsByIds',
    'searchCars',
  ]);
  spy.addFavorite.and.returnValue(of(void 0));
  spy.removeFavorite.and.returnValue(of(void 0));
  spy.getUserFavorites.and.returnValue(of([]));
  spy.getCarsPaginated.and.returnValue(of([]));
  spy.getCarById.and.returnValue(of(null));
  spy.getCarsByIds.and.returnValue(of([]));
  spy.searchCars.and.returnValue(of([]));
  return spy;
}

export function createCarRepositorySpy() {
  const spy = jasmine.createSpyObj('CarRepository', [
    'getCarsPaginated',
    'getCarById',
    'getCarsByIds',
    'searchCars',
  ]);
  spy.getCarsPaginated.and.returnValue(of([]));
  spy.getCarById.and.returnValue(of(null));
  spy.getCarsByIds.and.returnValue(of([]));
  spy.searchCars.and.returnValue(of([]));
  return spy;
}

export function createFavoriteRepositorySpy() {
  const spy = jasmine.createSpyObj('FavoriteRepository', [
    'addFavorite',
    'removeFavorite',
    'getUserFavorites',
  ]);
  spy.addFavorite.and.returnValue(of(void 0));
  spy.removeFavorite.and.returnValue(of(void 0));
  spy.getUserFavorites.and.returnValue(of([]));
  return spy;
}

export function createFavoritesServiceSpy() {
  return jasmine.createSpyObj('FavoritesService', ['isFavorite', 'toggle'], {
    favoriteIds: signal(new Set<string>()),
  });
}

/** Creates a chainable Supabase query builder mock that is also thenable. */
export function createQueryChain(result: { data: any; error: any }): any {
  const q: any = {
    then(resolve: Function, reject?: Function) {
      return Promise.resolve(result).then(resolve as any, reject as any);
    },
  };
  ['select', 'order', 'range', 'eq', 'delete', 'insert', 'in', 'single', 'or', 'not', 'update'].forEach(m => {
    q[m] = jasmine.createSpy(m).and.returnValue(q);
  });
  return q;
}

export function createSupabaseAuthSpy(overrides: Record<string, any> = {}) {
  return {
    signUp: jasmine.createSpy('signUp').and.returnValue(
      Promise.resolve({ data: { user: mockUser, session: null }, error: null })
    ),
    signInWithPassword: jasmine.createSpy('signInWithPassword').and.returnValue(
      Promise.resolve({ data: { user: mockUser, session: null }, error: null })
    ),
    signOut: jasmine.createSpy('signOut').and.returnValue(
      Promise.resolve({ error: null })
    ),
    getUser: jasmine.createSpy('getUser').and.returnValue(
      Promise.resolve({ data: { user: null }, error: null })
    ),
    onAuthStateChange: jasmine.createSpy('onAuthStateChange').and.returnValue({
      data: { subscription: { unsubscribe: jasmine.createSpy('unsubscribe') } },
    }),
    ...overrides,
  };
}
