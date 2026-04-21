import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { DatabaseService } from './services/database/database.service';
import { TranslationService } from './services/translation/translation.service';
import { FavoritesService } from './services/favorites/favorites.service';
import { SupabaseService } from './services/supabase/supabase.service';
import {
  createAuthServiceSpy,
  createDatabaseServiceSpy,
  createFavoritesServiceSpy,
  createMockTranslationService,
  createSupabaseServiceSpy,
} from '../testing/test-helpers';

describe('AppComponent', () => {
  beforeEach(async () => {
    const { spy: authSpy } = createAuthServiceSpy();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: AuthService, useValue: authSpy },
        { provide: DatabaseService, useValue: createDatabaseServiceSpy() },
        { provide: TranslationService, useValue: createMockTranslationService() },
        { provide: FavoritesService, useValue: createFavoritesServiceSpy() },
        { provide: SupabaseService, useValue: createSupabaseServiceSpy() },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
