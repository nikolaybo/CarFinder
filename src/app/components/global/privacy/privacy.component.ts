import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {}
