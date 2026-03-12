import { Directive, ElementRef, inject, input, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, takeUntilDestroyed } from 'rxjs';

@Directive({
  selector: '[appSlotText]',
  standalone: true,
})
export class SlotTextDirective {
  readonly appSlotText = input.required<string>();

  constructor() {
    const el = inject(ElementRef<HTMLElement>);
    const renderer = inject(Renderer2);
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    if (!isBrowser) return;

    toObservable(this.appSlotText).pipe(
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(text => {
      while (el.nativeElement.firstChild) {
        renderer.removeChild(el.nativeElement, el.nativeElement.firstChild);
      }

      text.split('').forEach((char: string, i: number) => {
        const span: HTMLElement = renderer.createElement('span');
        renderer.addClass(span, 'slot-letter');
        renderer.setStyle(span, 'animation-delay', `${(0.1 + i * 0.09).toFixed(2)}s`);
        renderer.setProperty(span, 'textContent', char);
        renderer.appendChild(el.nativeElement, span);
      });
    });
  }
}
