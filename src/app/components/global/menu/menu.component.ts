import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslatePipe } from '../../../common/pipes/translate.pipe';

@Component({
  selector: 'app-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  readonly isLoggedIn = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.authService.getUser()
      .pipe(takeUntilDestroyed())
      .subscribe(userResponse => {
        this.isLoggedIn.set(!!userResponse?.data?.user);
      });
  }

  logOut(): void {
    this.authService.logOut()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
