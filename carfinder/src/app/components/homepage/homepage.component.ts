import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CarListComponent } from '../car-list/car-list.component';

@Component({
  selector: 'app-homepage',
  imports: [MatButtonModule, CarListComponent],
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
