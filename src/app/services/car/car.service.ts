import { Injectable, signal } from '@angular/core';
import { Car } from '../../interfaces/car-interface';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly _selectedCar = signal<Car | null>(null);
  readonly selectedCar = this._selectedCar.asReadonly();

  setCar(car: Car): void {
    this._selectedCar.set(car);
  }
}
