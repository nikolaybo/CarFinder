import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.getUser().pipe(
    take(1),
    map(userResponse =>
      userResponse?.data?.user ? router.createUrlTree(['/']) : true
    )
  );
};
