import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../common/global-constants';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FooterItems } from '../../../common/footer-items';
import { Link } from '../../../interfaces/footer-links-interfaces';

@Component({
  selector: 'app-footer',
  imports: [],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  logo: string = GlobalConstants.appLogo;
  title: string = GlobalConstants.appTitle;
  currentYear: number = new Date().getFullYear();
  copyrightText: string = `© ${this.currentYear} ${this.title}. All Rights Reserved`;
  footerRoutes: Link[] = [];

  constructor(private bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {
    this.footerRoutes = FooterItems.items;
  }

  openSheet(event: Event, params: any): void {
    event.preventDefault();
    switch (params.title) {
      case "Terms of Service":
        this.bottomSheet.open(BottomSheetComponent, {data: {component: params.component}});
        break;
      case "Privacy Policy":
        this.bottomSheet.open(BottomSheetComponent, {data: {component: params.component}});
        break;
      default:  // Do nothing
        break;
    }
  }
}
