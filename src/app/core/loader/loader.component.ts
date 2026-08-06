import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MotionService } from '../services/motion.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="loader-overlay"
      [class.hidden]="hidden()"
      role="status"
      aria-live="polite"
      [attr.aria-hidden]="hidden()"
      aria-label="Loading OIL website"
    >
      <div class="loader__content">
        <img src="logo.png" alt="OIL" class="loader__logo" width="72" height="72" />
        <span class="loader__wordmark">OIL</span>
        <div class="loader__bar" aria-hidden="true">
          <div class="loader__bar-fill"></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit {
  protected readonly hidden = signal(false);
  private readonly motion = inject(MotionService);
  private readonly i18n = inject(I18nService);

  // minimum visible time for the loader (ms)
  private readonly minVisible = 1500;

  // critical images to preload (hero + logo)
  private readonly criticalImages = [
    'logo.png',
    'images/hero/hero-1.webp',
    'images/hero/hero-2.webp',
    'images/hero/hero-3.webp',
    'images/hero/hero-1-mobile.webp',
    'images/hero/hero-2-mobile.webp',
    'images/hero/hero-3-mobile.webp',
  ];

  ngOnInit(): void {
    // if user prefers reduced motion, shorten animations
    const reduced = this.motion.prefersReducedMotion();

    // start hidden=false (visible). We'll hide after all criteria met.
    this.hidden.set(false);

    const minDuration = new Promise((res) => setTimeout(res, reduced ? 0 : this.minVisible));

    const translationsLoaded = new Promise((res) => {
      const check = () => {
        if (this.i18n.isLoaded()) {
          res(undefined);
        } else {
          // poll via microtask — i18n uses signals so we can observe
          setTimeout(check, 50);
        }
      };
      check();
    });

    const preloadImages = Promise.all(
      this.criticalImages.map((p) =>
        new Promise((res) => {
          try {
            const img = new Image();
            img.src = p;
            img.onload = () => res(undefined);
            img.onerror = () => res(undefined);
            // cap in case browser stalls
            setTimeout(() => res(undefined), 2500);
          } catch (_) {
            res(undefined);
          }
        }),
      ),
    );

    // when language switch requested, show loader for minVisible
    const onLangSwitch = () => {
      this.hidden.set(false);
      setTimeout(() => this.hidden.set(true), reduced ? 0 : this.minVisible);
    };

    document.addEventListener('oil:lang-switch', onLangSwitch);

    Promise.all([minDuration, translationsLoaded, preloadImages]).then(() => {
      // allow CSS transition to fade out
      const fadeDelay = reduced ? 0 : 300;
      setTimeout(() => this.hidden.set(true), fadeDelay);
    });
  }
}
