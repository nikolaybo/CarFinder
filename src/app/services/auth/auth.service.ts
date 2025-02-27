import { Injectable } from '@angular/core';
import { AuthResponse, createClient, UserResponse } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { from, ReplaySubject, Observable, tap } from 'rxjs';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new ReplaySubject<UserResponse | null>(1); // ✅ Store user state
  user$: Observable<UserResponse | null> = this.userSubject.asObservable();  // ✅ Expose user state

  constructor() {
    this.checkAuthState(); // ✅ Initialize user state
  }

  register(email: string, username: string, password: string): Observable<AuthResponse> {
    const promise = supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      },
    });
    return from(promise);
  }

  logIn(email: string, password: string): Observable<AuthResponse> {
    const promise = supabase.auth.signInWithPassword({
      email,
      password,
    });
    return from(promise);
  }

  logOut(): Observable<any> {
    const promise = supabase.auth.signOut();
    return from(promise).pipe(
      tap(() => {
        this.userSubject.next(null);
      })
    );
  }

  getUser(): Observable<UserResponse | null> {
    return this.user$; // ✅ Return user observable
  }

  private async checkAuthState(): Promise<void> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      this.userSubject.next(null);
    } else {
      this.userSubject.next(data ? { data, error: null } : null);
    }

    // Listen for real-time auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.userSubject.next({ data: { user: session.user }, error: null });
      } else {
        this.userSubject.next(null);
      }
    });
  }

}
