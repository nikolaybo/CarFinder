import { inject, Injectable, OnDestroy } from '@angular/core';
import type { AuthResponse, User, UserResponse } from '@supabase/supabase-js';
import { from, map, ReplaySubject, Observable, tap } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private readonly userSubject = new ReplaySubject<UserResponse | null>(1);
  private authSubscription: { unsubscribe: () => void } | null = null;

  readonly user$: Observable<UserResponse | null> = this.userSubject.asObservable();
  readonly currentUser$: Observable<User | null> = this.user$.pipe(
    map(response => response?.data?.user ?? null)
  );

  constructor() {
    this.initAuthState();
  }

  register(email: string, username: string, password: string): Observable<AuthResponse> {
    return from(
      this.supabase.client.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
    );
  }

  logIn(email: string, password: string): Observable<AuthResponse> {
    return from(
      this.supabase.client.auth.signInWithPassword({ email, password })
    );
  }

  logOut(): Observable<{ error: unknown }> {
    return from(this.supabase.client.auth.signOut()).pipe(
      tap(() => this.userSubject.next(null))
    );
  }

  /**
   * Seeds the auth state from the persisted Supabase session, then subscribes to
   * auth state changes so user$ stays current for the lifetime of the app.
   * The initial getUser() call is awaited so that user$ emits before the first
   * route guard check runs.
   */
  private async initAuthState(): Promise<void> {
    const { data: sessionData, error: sessionError } = await this.supabase.client.auth.getUser();
    this.userSubject.next(sessionError ? null : (sessionData ? { data: sessionData, error: null } : null));

    const { data: { subscription } } = this.supabase.client.auth.onAuthStateChange(
      (_event, activeSession) => {
        if (activeSession?.user) {
          this.userSubject.next({ data: { user: activeSession.user }, error: null });
        } else {
          this.userSubject.next(null);
        }
      }
    );
    this.authSubscription = subscription;
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
