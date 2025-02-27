import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { Car } from '../../../interfaces/car-interface';
import { AuthService } from '../../../services/auth/auth.service';
import { CarItemComponent } from '../../car-list/car-item/car-item.component';

@Component({
  selector: 'app-profile',
  imports: [CarItemComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userId: string | undefined = ''; // Retrieve from auth
  favoriteCars: Car[] = [];

  constructor(private dbService: DatabaseService, private authService: AuthService) {}

  async ngOnInit() {
    this.authService.getUser().subscribe(userResponse => {
      this.userId = userResponse?.data?.user?.id; // ✅ Check if user is logged in
    });
    if (this.userId) {
      // Fetch favorite car IDs
      const favoriteCarsData = await this.dbService.getUserFavorites(this.userId);

      if (favoriteCarsData.length === 0) {
        console.error('No favorite cars found.');
        return;
      }

      const favoriteCarIds = favoriteCarsData.map((fav: any) => fav); // Extract car IDs

      // Fetch full car details
      this.favoriteCars = await this.dbService.getCarsByIds(favoriteCarIds);
    }
  }

}
