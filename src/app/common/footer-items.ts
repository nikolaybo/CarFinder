import { PrivacyComponent } from '../components/global/privacy/privacy.component';
import { TermsComponent } from '../components/global/terms/terms.component';
import type { Link } from '../interfaces/footer-links-interfaces';

export const FOOTER_ITEMS: readonly Link[] = [
  { title: 'footer.privacy', component: PrivacyComponent },
  { title: 'footer.terms', component: TermsComponent },
];
