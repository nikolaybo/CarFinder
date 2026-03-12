import { inject, Injectable, OnDestroy } from '@angular/core';
import type { AuthResponse, User, UserResponse } from '@supabase/supabase-js';
import { from, map, ReplaySubject, Observable, tap } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly userSubject = new ReplaySubject<UserResponse | null>(1);
  readonly user$: Observable<UserResponse | null> = this.userSubject.asObservable();
  readonly currentUser$: Observable<User | null> = this.user$.pipe(
    map(response => response?.data?.user ?? null)
  );

  private readonly supabase = inject(SupabaseService);
  private authSubscription: { unsubscribe: () => void } | null = null;

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

  getUser(): Observable<UserResponse | null> {
    return this.user$;
  }

  private async initAuthState(): Promise<void> {
    const { data, error } = await this.supabase.client.auth.getUser();
    this.userSubject.next(error ? null : (data ? { data, error: null } : null));

    const { data: { subscription } } = this.supabase.client.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          this.userSubject.next({ data: { user: session.user }, error: null });
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
