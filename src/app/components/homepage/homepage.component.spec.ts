import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PLATFORM_ID } from '@angular/core';
import { HomepageComponent } from './homepage.component';
import { DatabaseService } from '../../services/database/database.service';
import { TranslationService } from '../../services/translation/translation.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { SupabaseService } from '../../services/supabase/supabase.service';
import {
  createMockTranslationService,
  createDatabaseServiceSpy,
  createFavoritesServiceSpy,
  createSupabaseServiceSpy,
} from '../../../testing/test-helpers';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  async function buildFixture(platformId = 'browser') {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: DatabaseService, useValue: createDatabaseServiceSpy() },
        { provide: TranslationService, useValue: createMockTranslationService() },
        { provide: FavoritesService, useValue: createFavoritesServiceSpy() },
        { provide: SupabaseService, useValue: createSupabaseServiceSpy() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', fakeAsync(async () => {
    await buildFixture();
    tick();
    expect(component).toBeTruthy();
  }));

  it('scrollToCarList() calls document.getElementById when on the browser platform', fakeAsync(async () => {
    await buildFixture('browser');
    const mockElement = { scrollIntoView: jasmine.createSpy('scrollIntoView') };
    spyOn(document, 'getElementById').and.returnValue(mockElement as any);
    component.scrollToCarList();
    tick();
    expect(document.getElementById).toHaveBeenCalledWith('car-list');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  }));

  it('scrollToCarList() does nothing on the server platform', fakeAsync(async () => {
    await buildFixture('server');
    spyOn(document, 'getElementById');
    component.scrollToCarList();
    tick();
    expect(document.getElementById).not.toHaveBeenCalled();
  }));
});
