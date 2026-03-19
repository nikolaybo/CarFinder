import { TestBed } from '@angular/core/testing';
import { CarService } from './car.service';
import { mockCar } from '../../../testing/test-helpers';

describe('CarService', () => {
  let service: CarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('selectedCar is null initially', () => {
    expect(service.selectedCar()).toBeNull();
  });

  it('setCar() updates selectedCar', () => {
    service.setCar(mockCar);
    expect(service.selectedCar()).toEqual(mockCar);
  });

  it('setCar() replaces a previously set car', () => {
    const other = { ...mockCar, id: 'car-2', model: 'BMW M3' };
    service.setCar(mockCar);
    service.setCar(other);
    expect(service.selectedCar()).toEqual(other);
  });
});
