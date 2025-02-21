import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MenuComponent } from '../menu/menu.component';
import { GlobalConstants } from '../../../common/global-constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchComponent, MenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  logo: string = GlobalConstants.appLogo;

}
