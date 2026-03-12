import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth.service';
import { FormErrorPipe } from '../../../common/pipes/form-error.pipe';
import { APP_CONSTANTS } from '../../../common/global-constants';
import { SlotTextDirective } from '../../../common/directives/slot-text.directive';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';
import { TranslationService } from '../../../services/translation/translation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatInputModule, MatIconModule, FormErrorPipe, SlotTextDirective, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly logo = APP_CONSTANTS.appLogo;
  readonly ts = inject(TranslationService);

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const { email, username, password } = this.registerForm.getRawValue();

    this.authService.register(email, username, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.error) {
          this.snackBar.open(result.error.message, 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snack-error'],
          });
        } else {
          this.router.navigateByUrl('/');
        }
      });
  }
}
