import { Directive, ElementRef, Input, NgZone, OnChanges, PLATFORM_ID, SimpleChanges, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({ selector: '[appSlotText]', standalone: true })
export class SlotTextDirective implements OnChanges {
  @Input({ required: true }) appSlotText!: string;

  private readonly zone = inject(NgZone);
  private readonly hostEl = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Rebuilds the slot-machine letter animation whenever appSlotText changes.
   * Each character gets its own <span> with a staggered CSS animation-delay
   * so letters appear to "spin in" one after another.
   *
   * Uses direct DOM APIs instead of Renderer2 because Angular's AnimationRenderer
   * (loaded by provideAnimationsAsync) defers Renderer2.removeChild calls to allow
   * leave animations — making the cleanup while-loop spin forever. Direct APIs
   * remove children synchronously and are safe since we own all child nodes here.
   *
   * Runs outside Angular's zone so DOM mutations don't cause Zone.js to schedule
   * an extra CD cycle after the spans are inserted.
   *
   * @param changes - Angular's SimpleChanges map; only proceeds when appSlotText changed.
   * @returns void — results are written directly to the host element's DOM.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser || !changes['appSlotText']) return;

    const text = changes['appSlotText'].currentValue as string;

    this.zone.runOutsideAngular(() => {
      this.hostEl.innerHTML = '';
      text.split('').forEach((char: string, charIndex: number) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'slot-letter';
        letterSpan.style.animationDelay = `${(0.1 + charIndex * 0.09).toFixed(2)}s`;
        letterSpan.textContent = char;
        this.hostEl.appendChild(letterSpan);
      });
    });
  }
}
