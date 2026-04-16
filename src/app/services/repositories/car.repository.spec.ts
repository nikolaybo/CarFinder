import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CarRepository } from './car.repository';
import { SupabaseService } from '../supabase/supabase.service';
import { mockCar } from '../../../testing/test-helpers';

const REQUIRED_CAR_FIELDS = [
  'id', 'model', 'type', 'fuel_consumption',
  'price', 'discounted_price', 'gearbox', 'image', 'seats',
] as const;

/**
 * Fluent builder mimicking Supabase PostgrestFilterBuilder. Every filter method
 * returns `this`; the final awaited value is `{ data, error }`.
 */
function supabaseTableMock(response: { data: any; error: any }) {
  const builder: any = {
    select: () => builder,
    order: () => builder,
    range: () => builder,
    eq: () => builder,
    in: () => builder,
    or: () => builder,
    single: () => Promise.resolve(response),
    then: (onFulfilled: (v: any) => any) => Promise.resolve(response).then(onFulfilled),
  };
  return builder;
}

describe('CarRepository', () => {
  let repo: CarRepository;
  let fromSpy: jasmine.Spy;

  function setup(response: { data: any; error: any }) {
    fromSpy = jasmine.createSpy('from').and.returnValue(supabaseTableMock(response));
    const supabaseStub = { client: { from: fromSpy } };
    TestBed.configureTestingModule({
      providers: [
        CarRepository,
        { provide: SupabaseService, useValue: supabaseStub },
      ],
    });
    repo = TestBed.inject(CarRepository);
  }

  describe('Car shape contract', () => {
    it('getCarById returns an object with every required field', async () => {
      setup({ data: mockCar, error: null });
      const car = await firstValueFrom(repo.getCarById('car-1'));
      expect(car).not.toBeNull();
      for (const field of REQUIRED_CAR_FIELDS) {
        expect(car).withContext(`missing field: ${field}`).toEqual(
          jasmine.objectContaining({ [field]: jasmine.anything() })
        );
      }
    });

    it('getCarsPaginated returns objects with every required field', async () => {
      setup({ data: [mockCar], error: null });
      const cars = await firstValueFrom(repo.getCarsPaginated(1, 5));
      expect(cars.length).toBe(1);
      for (const field of REQUIRED_CAR_FIELDS) {
        expect(cars[0]).withContext(`missing field: ${field}`).toEqual(
          jasmine.objectContaining({ [field]: jasmine.anything() })
        );
      }
    });
  });

  describe('graceful-degrade invariants', () => {
    it('getCarsPaginated returns [] when Supabase returns an error', async () => {
      setup({ data: null, error: new Error('db down') });
      spyOn(console, 'error');
      const cars = await firstValueFrom(repo.getCarsPaginated(1, 5));
      expect(cars).toEqual([]);
    });

    it('getCarById returns null when Supabase returns an error', async () => {
      setup({ data: null, error: new Error('db down') });
      spyOn(console, 'error');
      const car = await firstValueFrom(repo.getCarById('car-1'));
      expect(car).toBeNull();
    });

    it('getCarsByIds returns [] when the id list is empty (no DB call)', async () => {
      setup({ data: [], error: null });
      const cars = await firstValueFrom(repo.getCarsByIds([]));
      expect(cars).toEqual([]);
      expect(fromSpy).not.toHaveBeenCalled();
    });

    it('searchCars returns [] when the query is whitespace-only (no DB call)', async () => {
      setup({ data: [], error: null });
      const cars = await firstValueFrom(repo.searchCars('   '));
      expect(cars).toEqual([]);
      expect(fromSpy).not.toHaveBeenCalled();
    });
  });
});
