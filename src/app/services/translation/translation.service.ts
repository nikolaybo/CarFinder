import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

export type Locale = 'en' | 'bg';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);

  readonly locale = signal<Locale>(this.getSavedLocale());
  private readonly translations = signal<Record<string, string>>({});

  constructor() {
    this.load(this.locale());
  }

  t(key: string): string {
    return this.translations()[key] ?? key;
  }

  setLocale(locale: Locale): void {
    if (locale === this.locale()) return;
    this.locale.set(locale);
    localStorage.setItem('cf_locale', locale);
    this.load(locale);
  }

  private load(locale: Locale): void {
    this.http
      .get<Record<string, string>>(`/assets/i18n/${locale}.json`)
      .subscribe(data => this.translations.set(data));
  }

  private getSavedLocale(): Locale {
    try {
      const saved = localStorage.getItem('cf_locale');
      return saved === 'bg' ? 'bg' : 'en';
    } catch {
      return 'en';
    }
  }
}
