import { Component, Input, Signal, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CarService } from '../../../services/car/car.service';
import { Car } from '../../../interfaces/car-interface';
import { DatabaseService } from '../../../services/database/database.service';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
  selector: 'app-car-item',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, DecimalPipe],
  templateUrl: './car-item.component.html',
  styleUrl: './car-item.component.scss'
})
export class CarItemComponent {
  @Input() car!: Car; // Receives car object from CarListComponent
  @Input() showFavoriteButton: boolean = true; // Default is true
  userId: string | undefined = '';
  isFavorite = signal(false);

  constructor(private router: Router, private carService: CarService, private dbService: DatabaseService, private authService: AuthService) {}

  async ngOnInit() {
    this.authService.getUser().subscribe(userResponse => {
      this.userId = userResponse?.data?.user?.id; // ✅ Check if user is logged in
    });
    const favoriteCarIds = await this.dbService.getUserFavorites(this.userId);
    this.isFavorite.set(favoriteCarIds.includes(this.car.id));
  }

  goToCarView(): void {
    this.carService.setCar(this.car); // Store car in the signal
    this.router.navigate(['/car-view', this.car.id]); // Navigate to car-view
  }

  async toggleFavorite() {
    if (this.isFavorite()) {
      await this.dbService.removeFavorite(this.userId, this.car.id);
      this.isFavorite.set(false);
    } else {
      await this.dbService.addFavorite(this.userId, this.car.id);
      this.isFavorite.set(true);
    }
  }
}
