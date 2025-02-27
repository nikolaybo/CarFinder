import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.getUser().pipe(
      map(userResponse => {
        if (userResponse?.data?.user) {
          // Avoid race condition: Use setTimeout to prevent guard execution issues
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0);
          return false; // 🚫 User is logged in, prevent access
        }
        return true; // ✅ Allow access
      })
    );
  }

}
