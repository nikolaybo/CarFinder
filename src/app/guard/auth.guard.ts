import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * SSR note: Supabase session persistence is disabled on the server
 * (see SupabaseService), so auth.user$ emits null during server render.
 * Any route under RenderMode.Server will therefore redirect to /login
 * even for authenticated users. Keep protected routes on RenderMode.Client.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user$.pipe(
    take(1),
    map(userResponse =>
      userResponse?.data?.user ? true : router.createUrlTree(['/login'])
    )
  );
};
