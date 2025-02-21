import { Component, inject, OnInit } from '@angular/core';
import { CarService } from '../../../services/car/car.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Car } from '../../../interfaces/car-interface';

@Component({
  selector: 'app-car-view',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './car-view.component.html',
  styleUrl: './car-view.component.scss'
})
export class CarViewComponent implements OnInit {
  carService = inject(CarService);
  car: Car | undefined;

  constructor(private router: Router, activeRoute: ActivatedRoute) {
    activeRoute.paramMap.subscribe(params => {
      const carId = params.get('id'); // Get ID from route
      if (carId) {
        this.car = this.carService.getCar()(); // Retrieve from signal (already stored)
        console.log("Car ID from route:", this.car);
      }
    });
  }

  ngOnInit() {
    // Redirect if no car data is available
    if (!this.car) {
      this.router.navigate(['/']); // Navigate to the homepage or another page
    }
  }
}
