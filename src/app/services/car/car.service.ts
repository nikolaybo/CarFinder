import { Injectable, Signal, signal } from '@angular/core';
import { Car } from '../../interfaces/car-interface';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly _selectedCar = signal<Car | null>(null);
  readonly selectedCar: Signal<Car | null> = this._selectedCar.asReadonly();

  setCar(car: Car): void {
    this._selectedCar.set(car);
  }

  getCar(): Signal<Car | null> {
    return this._selectedCar;
  }
}
