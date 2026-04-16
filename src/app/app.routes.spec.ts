import { routes } from './app.routes';
import { authGuard } from './guard/auth.guard';
import { guestGuard } from './guard/guest.guard';

/**
 * Pure structural assertions — no Angular TestBed needed.
 * Catches accidental route regressions (missing guard, lost lazy-loaded chunk,
 * removed wildcard fallback) without booting the application.
 */
describe('app.routes', () => {
  const byPath = (path: string) => routes.find(r => r.path === path);

  it('every non-wildcard route is lazy-loaded via loadComponent', () => {
    for (const route of routes) {
      if (route.path === '**') continue;
      expect(typeof route.loadComponent).toBe('function');
    }
  });

  it('protected routes require authGuard', () => {
    for (const path of ['', 'car-view/:id', 'profile']) {
      const route = byPath(path);
      expect(route).withContext(`route "${path}" missing`).toBeDefined();
      expect(route!.canActivate).toContain(authGuard);
    }
  });

  it('public auth routes use guestGuard so signed-in users cannot revisit them', () => {
    for (const path of ['login', 'register']) {
      const route = byPath(path);
      expect(route).withContext(`route "${path}" missing`).toBeDefined();
      expect(route!.canActivate).toContain(guestGuard);
    }
  });

  it('declares a wildcard 404 fallback as the last entry', () => {
    expect(routes[routes.length - 1].path).toBe('**');
  });

  it('every route exposes a unique path', () => {
    const paths = routes.map(r => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
