import { TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { mockUser, createSupabaseAuthSpy } from '../../../testing/test-helpers';

describe('AuthService', () => {
  let service: AuthService;
  let authSpy: ReturnType<typeof createSupabaseAuthSpy>;

  beforeEach(() => {
    authSpy = createSupabaseAuthSpy();
    const mockClient = { auth: authSpy };
    const supabaseSpy = jasmine.createSpyObj('SupabaseService', [], { client: mockClient });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: supabaseSpy },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calls auth.getUser() on construction to seed auth state', () => {
    expect(authSpy.getUser).toHaveBeenCalled();
  });

  it('calls auth.onAuthStateChange() on construction', async () => {
    await Promise.resolve(); // yield once so initAuthState()'s awaited getUser() can resolve
    expect(authSpy.onAuthStateChange).toHaveBeenCalled();
  });

  describe('register()', () => {
    it('calls supabase.auth.signUp with email, password, and username', fakeAsync(async () => {
      authSpy.signUp.and.returnValue(
        Promise.resolve({ data: { user: mockUser, session: null }, error: null })
      );
      const result = await firstValueFrom(service.register('a@b.com', 'alice', 'pass1234'));
      expect(authSpy.signUp).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'pass1234',
        options: { data: { username: 'alice' } },
      });
      expect(result.error).toBeNull();
      tick();
    }));

    it('propagates auth error from signUp', fakeAsync(async () => {
      const error = { message: 'Email already taken' } as any;
      authSpy.signUp.and.returnValue(
        Promise.resolve({ data: { user: null, session: null }, error })
      );
      const result = await firstValueFrom(service.register('a@b.com', 'alice', 'pass'));
      expect(result.error).toEqual(error);
      tick();
    }));
  });

  describe('logIn()', () => {
    it('calls supabase.auth.signInWithPassword with email and password', fakeAsync(async () => {
      authSpy.signInWithPassword.and.returnValue(
        Promise.resolve({ data: { user: mockUser, session: null }, error: null })
      );
      const result = await firstValueFrom(service.logIn('a@b.com', 'pass1234'));
      expect(authSpy.signInWithPassword).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'pass1234',
      });
      expect(result.error).toBeNull();
      tick();
    }));

    it('propagates auth error from signInWithPassword', fakeAsync(async () => {
      const error = { message: 'Invalid credentials' } as any;
      authSpy.signInWithPassword.and.returnValue(
        Promise.resolve({ data: { user: null, session: null }, error })
      );
      const result = await firstValueFrom(service.logIn('a@b.com', 'wrong'));
      expect(result.error).toEqual(error);
      tick();
    }));
  });

  describe('logOut()', () => {
    it('calls supabase.auth.signOut', fakeAsync(async () => {
      await firstValueFrom(service.logOut());
      expect(authSpy.signOut).toHaveBeenCalled();
      tick();
    }));

    it('emits null on user$ after logout', fakeAsync(async () => {
      await firstValueFrom(service.logOut());
      tick();
      const userResponse = await firstValueFrom(service.user$);
      expect(userResponse).toBeNull();
    }));
  });

  describe('ngOnDestroy()', () => {
    it('calls unsubscribe on the auth state subscription', async () => {
      await Promise.resolve(); // allow initAuthState() to complete so the subscription is registered
      const subscription = authSpy.onAuthStateChange.calls.mostRecent()?.returnValue;
      service.ngOnDestroy();
      expect(subscription?.data?.subscription?.unsubscribe).toHaveBeenCalled();
    });
  });
});
