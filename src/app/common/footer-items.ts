import { PrivacyComponent } from '../components/global/privacy/privacy.component';
import { TermsComponent } from '../components/global/terms/terms.component';
import { Link } from '../interfaces/footer-links-interfaces';

export class FooterItems {
  public static items: Link[] = [
    {
      title: "Privacy Policy",
      component: PrivacyComponent,
    },
    {
      title: "Terms of Service",
      component: TermsComponent,
    }
  ];
}
