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
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0);
          return false;
        }
        return true;
      })
    );
  }

}
