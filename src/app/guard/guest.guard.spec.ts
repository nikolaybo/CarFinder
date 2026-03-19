import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth/auth.service';
import { mockUser } from '../../testing/test-helpers';

describe('guestGuard', () => {
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
      guestGuard({} as any, {} as any)
    ) as Observable<boolean | UrlTree>;
  }

  it('allows access when userResponse is null (guest)', (done) => {
    setup(null);
    run().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('allows access when userResponse has no user', (done) => {
    setup({ data: { user: null }, error: null });
    run().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('redirects to / when user is authenticated', (done) => {
    setup({ data: { user: mockUser }, error: null });
    run().subscribe(result => {
      expect(result instanceof UrlTree).toBeTrue();
      expect((result as UrlTree).toString()).toBe('/');
      done();
    });
  });
});
