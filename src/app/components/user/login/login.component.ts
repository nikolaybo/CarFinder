import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../services/notification/notification.service';
import { AuthService } from '../../../services/auth/auth.service';
import { FormErrorPipe } from '../../../common/pipes/form-error.pipe';
import { APP_CONSTANTS } from '../../../common/global-constants';
import { SlotTextDirective } from '../../../common/directives/slot-text.directive';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';
import { TranslationService } from '../../../services/translation/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatIconModule, FormErrorPipe, SlotTextDirective, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly logo = APP_CONSTANTS.appLogo;
  readonly ts = inject(TranslationService);

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  /**
   * Submits the login form. On a Supabase auth error the message is surfaced
   * via a top-centred snackbar so the user knows why sign-in failed. On success
   * the user is sent to the homepage and the auth state listener in AuthService
   * handles propagating the new session across the app.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.getRawValue();

    this.authService.logIn(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(authResult => {
        if (authResult.error) {
          this.notificationService.showError(authResult.error.message);
        } else {
          this.notificationService.showSuccess(this.ts.t('login.success'));
          this.router.navigateByUrl('/');
        }
      });
  }
}
