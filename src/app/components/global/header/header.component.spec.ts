import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../services/auth/auth.service';
import { DatabaseService } from '../../../services/database/database.service';
import { TranslationService } from '../../../services/translation/translation.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { SupabaseService } from '../../../services/supabase/supabase.service';
import {
  createMockTranslationService,
  createDatabaseServiceSpy,
  createFavoritesServiceSpy,
  createAuthServiceSpy,
  createSupabaseServiceSpy,
} from '../../../../testing/test-helpers';
import type { Locale } from '../../../services/translation/translation.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockTs: ReturnType<typeof createMockTranslationService>;

  beforeEach(async () => {
    mockTs = createMockTranslationService();
    const { spy: authSpy } = createAuthServiceSpy();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: TranslationService, useValue: mockTs },
        { provide: AuthService, useValue: authSpy },
        { provide: DatabaseService, useValue: createDatabaseServiceSpy() },
        { provide: FavoritesService, useValue: createFavoritesServiceSpy() },
        { provide: SupabaseService, useValue: createSupabaseServiceSpy() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleLocale() switches from "en" to "bg"', () => {
    (mockTs.locale as ReturnType<typeof signal<Locale>>).set('en');
    component.toggleLocale();
    expect(mockTs.setLocale).toHaveBeenCalledWith('bg');
  });

  it('toggleLocale() switches from "bg" to "en"', () => {
    (mockTs.locale as ReturnType<typeof signal<Locale>>).set('bg');
    component.toggleLocale();
    expect(mockTs.setLocale).toHaveBeenCalledWith('en');
  });
});
