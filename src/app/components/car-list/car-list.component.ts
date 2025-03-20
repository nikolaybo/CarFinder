import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { MatButtonModule } from '@angular/material/button';
import { CarItemComponent } from './car-item/car-item.component';
import { Car } from '../../interfaces/car-interface';


@Component({
  selector: 'app-car-list',
  imports: [MatButtonModule, CarItemComponent],
  standalone: true,
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss'
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  page: number = 1;
  pageSize: number = 5;
  hasMoreCars: boolean = true;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadCars();
  }

  async loadCars() {
    const newCars = await this.databaseService.getCarsPaginated(this.page, this.pageSize);

    if (newCars.length > 0) {
      this.cars = [...this.cars, ...newCars];
      this.page++;
    }

    if (newCars.length < this.pageSize) {
      this.hasMoreCars = false;
    }
  }
}
