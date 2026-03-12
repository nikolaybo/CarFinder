import { ChangeDetectorRef, effect, inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../services/translation/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly ts = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.ts.locale(); // subscribe to locale changes
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    return this.ts.t(key);
  }
}
