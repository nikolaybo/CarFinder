import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { DatabaseService } from '../../../services/database/database.service';
import { CarService } from '../../../services/car/car.service';
import { TranslationService } from '../../../services/translation/translation.service';
import type { Car } from '../../../interfaces/car-interface';

@Component({
  selector: 'app-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatIconModule, DecimalPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  readonly searchTerm = signal('');
  readonly searchResults = signal<Car[]>([]);
  readonly ts = inject(TranslationService);

  private readonly dbService = inject(DatabaseService);
  private readonly router = inject(Router);
  private readonly carService = inject(CarService);
  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          this.searchResults.set([]);
          return of([] as Car[]);
        }
        return this.dbService.searchCars(query);
      }),
      takeUntilDestroyed()
    ).subscribe(results => this.searchResults.set(results));
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm());
  }

  goToCarView(car: Car): void {
    this.carService.setCar(car);
    this.router.navigate(['/car-view', car.id]);
    this.searchResults.set([]);
    this.searchTerm.set('');
  }
}
