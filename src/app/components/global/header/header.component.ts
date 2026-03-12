import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from '../search/search.component';
import { MenuComponent } from '../menu/menu.component';
import { APP_CONSTANTS } from '../../../common/global-constants';
import { TranslationService } from '../../../services/translation/translation.service';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, SearchComponent, MenuComponent, MatIconModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly logo = APP_CONSTANTS.appLogo;
  readonly ts = inject(TranslationService);

  toggleLocale(): void {
    this.ts.setLocale(this.ts.locale() === 'en' ? 'bg' : 'en');
  }
}
