import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, Subscription } from 'rxjs';

export type Locale = 'en' | 'bg';

const LOCALE_KEY = 'cf_locale';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);

  readonly locale = signal<Locale>(this.getSavedLocale());
  private readonly _translations = signal<Record<string, string>>({});

  // Tracks the in-flight HTTP request so a second toggle cancels the first.
  private pendingLoad: Subscription | null = null;

  constructor() {
    this.load(this.locale());
  }

  t(key: string): string {
    return this._translations()[key] ?? key;
  }

  /**
   * Switches the active locale. Cancels any in-flight load from a previous
   * toggle, then fetches the new translation file. Both `_translations` and
   * `locale` are updated together inside the subscription so Angular sees a
   * single atomic reactive write — avoiding a premature signal flush that
   * can race with Zone.js's CD cycle and cause the page to freeze.
   */
  setLocale(locale: Locale): void {
    if (locale === this.locale()) return;
    localStorage.setItem(LOCALE_KEY, locale);
    this.load(locale);
  }

  private load(locale: Locale): void {
    this.pendingLoad?.unsubscribe();
    this.pendingLoad = this.http
      .get<Record<string, string>>(`/assets/i18n/${locale}.json`)
      .pipe(catchError(() => EMPTY))
      .subscribe(data => {
        this._translations.set(data);
        this.locale.set(locale);
      });
  }

  private getSavedLocale(): Locale {
    try {
      return localStorage.getItem(LOCALE_KEY) === 'bg' ? 'bg' : 'en';
    } catch {
      return 'en';
    }
  }
}
