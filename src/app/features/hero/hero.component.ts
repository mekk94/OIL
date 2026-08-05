import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { MotionService } from '../../core/services/motion.service';
import { RevealDirective } from '../../core/directives/reveal.directive';



const HERO_SLIDES = [
  { srcDesktop: '/images/hero/hero-1.jpg', srcMobile: '/images/hero/hero-1-mobile.jpg', alt: 'OIL EPC civil construction project in Saudi Arabia' },
  { srcDesktop: '/images/hero/hero-2.jpg', srcMobile: '/images/hero/hero-2-mobile.jpg', alt: 'Electrical substation construction by OIL' },
  { srcDesktop: '/images/hero/hero-3.jpg', srcMobile: '/images/hero/hero-3-mobile.jpg', alt: 'Mechanical pipeline installation by OIL' },
];

const SLIDE_INTERVAL = 5000;

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="hero"
      class="hero"
      aria-label="OIL – Operations Integrated Limited hero"
    >
      <!-- Background slideshow -->
      <div class="hero__slides" aria-hidden="true">
        @for (slide of slides; track slide.srcDesktop; let i = $index) {
          <div
            class="hero__slide"
            [class.hero__slide--active]="activeIndex() === i"
          >
            <picture>
              <source media="(max-width: 767px)" [srcset]="slide.srcMobile" />
              <img [src]="slide.srcDesktop" [alt]="slide.alt" class="hero__slide-img" loading="eager" />
            </picture>
          </div>
        }
        <div class="hero__overlay"></div>
      </div>

      <!-- Content -->
      <div class="container hero__content">
        <div oilReveal class="hero__text" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
          <h1 class="hero__headline" [innerHTML]="i18n.t('hero.headline')"></h1>
          <p class="hero__desc" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">{{ i18n.t('hero.description') }}</p>
          <div class="hero__actions">
            <a href="#services" class="btn btn--gold">{{ i18n.t('hero.cta1') }}</a>
            <a href="#contact" class="btn btn--ghost">{{ i18n.t('hero.cta2') }}</a>
          </div>
        </div>
      </div>

      <!-- Slide indicators -->
      <div class="hero__indicators" aria-hidden="true">
        @for (slide of slides; track slide.srcDesktop; let i = $index) {
          <button
            class="hero__indicator"
            [class.hero__indicator--active]="activeIndex() === i"
            (click)="goTo(i)"
            [attr.aria-label]="'Go to slide ' + (i + 1)"
          ></button>
        }
      </div>

      <!-- Scroll cue -->
      <div class="hero__scroll-cue" aria-hidden="true">
        <svg class="chevron-icon chevron-icon--1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
        <svg class="chevron-icon chevron-icon--2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  private readonly motion = inject(MotionService);

  protected readonly slides = HERO_SLIDES;
  protected readonly activeIndex = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (!this.motion.prefersReducedMotion()) {
      this.timer = setInterval(() => {
        this.activeIndex.update((i) => (i + 1) % this.slides.length);
      }, SLIDE_INTERVAL);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }
}



