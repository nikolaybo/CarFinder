import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';
import { mockUser } from '../../testing/test-helpers';

describe('authGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;

  function setup(userResponse: any) {
    authSpy = jasmine.createSpyObj('AuthService', [], { user$: of(userResponse) });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
      ],
    });
  }

  function run() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    ) as Observable<boolean | UrlTree>;
  }

  it('allows navigation when user is authenticated', (done) => {
    setup({ data: { user: mockUser }, error: null });
    run().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('redirects to /login when userResponse is null', (done) => {
    setup(null);
    run().subscribe(result => {
      expect(result instanceof UrlTree).toBeTrue();
      expect((result as UrlTree).toString()).toBe('/login');
      done();
    });
  });

  it('redirects to /login when userResponse has no user', (done) => {
    setup({ data: { user: null }, error: null });
    run().subscribe(result => {
      expect(result instanceof UrlTree).toBeTrue();
      expect((result as UrlTree).toString()).toBe('/login');
      done();
    });
  });

  // Pins current SSR behavior. Supabase session is disabled on the server, so
  // user$ emits null during SSR — the guard must redirect. If a future change
  // wants to allow SSR through (e.g. cookie-based session), update this test
  // deliberately rather than silently.
  it('redirects to /login under SSR when no session is present', (done) => {
    setup(null);
    run().subscribe(result => {
      expect(result instanceof UrlTree).toBeTrue();
      expect((result as UrlTree).toString()).toBe('/login');
      done();
    });
  });
});
