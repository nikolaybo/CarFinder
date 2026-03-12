import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarListComponent } from '../car-list/car-list.component';
import { TranslatePipe } from '../../common/pipes/translate.pipe';

@Component({
  selector: 'app-homepage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, CarListComponent, TranslatePipe],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  private readonly platformId = inject(PLATFORM_ID);

  scrollToCarList(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('car-list')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
