import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DatabaseService } from '../../../services/database/database.service';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Car } from '../../../interfaces/car-interface';
import { CarService } from '../../../services/car/car.service';

@Component({
  selector: 'app-search',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    DecimalPipe,
  ],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchTerm: string = '';
  searchResults: any[] = [];
  private searchSubject = new Subject<string>();
  carService = inject(CarService);

  constructor(private dbService: DatabaseService, private router: Router) {
    // Debounce search to avoid too many API calls
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(query => {
      this.performSearch(query);
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm); // Emit search term
  }

  async performSearch(query: string) {
    if (!query) {
      this.searchResults = [];
      return;
    }
    this.searchResults = await this.dbService.searchCars(query);
  }

  goToCarView(car: Car) {
    this.carService.setCar(car); // Store car in the signal
    this.router.navigate(['/car-view', car.id]); // Navigate to car-view
    this.searchResults = []; // Clear search results
  }
}
