import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private selectedCar = signal<any>(null); // Stores the selected car

  setCar(car: any) {
    this.selectedCar.set(car);
  }

  getCar(): Signal<any> {
    return this.selectedCar;
  }
}
