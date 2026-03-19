import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem('cf_locale');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslationService],
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush the initial load triggered in the constructor
    httpMock.expectOne('/assets/i18n/en.json').flush({ hello: 'Hello', world: 'World' });
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('cf_locale');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts with locale "en" by default', () => {
    expect(service.locale()).toBe('en');
  });

  it('t() returns the translation for a loaded key', () => {
    expect(service.t('hello')).toBe('Hello');
    expect(service.t('world')).toBe('World');
  });

  it('t() returns the key itself when no translation is found', () => {
    expect(service.t('missing.key')).toBe('missing.key');
  });

  it('setLocale() changes the locale and loads new translations', () => {
    service.setLocale('bg');
    httpMock.expectOne('/assets/i18n/bg.json').flush({ hello: 'Здравей' });

    expect(service.locale()).toBe('bg');
    expect(service.t('hello')).toBe('Здравей');
  });

  it('setLocale() is a no-op when called with the current locale', () => {
    service.setLocale('en');
    httpMock.expectNone('/assets/i18n/en.json');
    expect(service.locale()).toBe('en');
  });

  it('reads saved locale "bg" from localStorage', () => {
    localStorage.setItem('cf_locale', 'bg');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslationService],
    });

    const service2 = TestBed.inject(TranslationService);
    const httpMock2 = TestBed.inject(HttpTestingController);

    expect(service2.locale()).toBe('bg');
    httpMock2.expectOne('/assets/i18n/bg.json').flush({});
    httpMock2.verify();
  });

  it('falls back to "en" for an invalid locale in localStorage', () => {
    localStorage.setItem('cf_locale', 'fr');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslationService],
    });

    const service2 = TestBed.inject(TranslationService);
    const httpMock2 = TestBed.inject(HttpTestingController);

    expect(service2.locale()).toBe('en');
    httpMock2.expectOne('/assets/i18n/en.json').flush({});
    httpMock2.verify();
  });
});
