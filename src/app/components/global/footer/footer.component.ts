import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { APP_CONSTANTS } from '../../../common/global-constants';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet/bottom-sheet.component';
import { FOOTER_ITEMS } from '../../../common/footer-items';
import type { Link } from '../../../interfaces/footer-links-interfaces';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly logo = APP_CONSTANTS.appLogo;
  readonly title = APP_CONSTANTS.appTitle;
  readonly currentYear = new Date().getFullYear();
  readonly footerRoutes = FOOTER_ITEMS;

  private readonly bottomSheet = inject(MatBottomSheet);

  openSheet(event: Event, item: Link): void {
    event.preventDefault();
    this.bottomSheet.open(BottomSheetComponent, { data: { component: item.component } });
  }
}
