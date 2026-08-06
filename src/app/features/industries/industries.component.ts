import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="industries" class="industries section--dark" aria-label="Industries we serve">
      <div class="container">
        <!-- Header -->
        <div class="section-header" oilReveal>
          <span class="section-label">{{ i18n.t('industries.sectionLabel') }}</span>
          <h2 class="section-heading">{{ i18n.t('industries.heading') }}</h2>
          <p class="section-subhead" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
            {{ i18n.t('industries.subhead') }}
          </p>
        </div>

        <!-- Carousel Layout: left filters | carousel | right filters -->
        <div class="industries__layout" oilReveal>
          <!-- Left Filters (first half of the items) -->
          <div class="industries__filters industries__filters--left" role="list">
            @for (item of leftItems(); track item.name; let i = $index) {
              <button
                class="industries__filter"
                [class.industries__filter--active]="activeIndex() === i"
                (click)="setActive(i)"
                role="listitem"
                [attr.aria-label]="item.name"
                [attr.aria-pressed]="activeIndex() === i"
              >
                {{ item.name }}
              </button>
            }
          </div>

          <!-- Center Carousel -->
          <div class="industries__carousel-wrap">
            <!-- Prev arrow -->
            <button
              class="industries__arrow industries__arrow--prev"
              (click)="prev()"
              aria-label="Previous industry"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            <div class="industries__carousel" aria-live="polite">
              @for (item of allItems(); track item.name; let i = $index) {
                <div
                  class="industries__card"
                  [class.industries__card--active]="activeIndex() === i"
                  [class.industries__card--prev]="relativePos(i) === -1"
                  [class.industries__card--next]="relativePos(i) === 1"
                  [class.industries__card--far]="Math.abs(relativePos(i)) > 1"
                  [attr.aria-hidden]="activeIndex() !== i"
                  role="group"
                  [attr.aria-label]="item.name + ', industry ' + (i + 1) + ' of ' + allItems().length"
                >
                  <div class="industries__card-img" aria-hidden="true">
                    <span class="industries__card-num">{{ i + 1 }}</span>
                    <img [src]="'images/industries/' + enItems()[i].name + '.png'" [alt]="item.name" loading="lazy" />
                  </div>
                  <div class="industries__card-content" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
                    <h3 class="industries__card-name">{{ item.name }}</h3>
                    <p class="industries__card-desc">{{ item.description }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Next arrow -->
            <button
              class="industries__arrow industries__arrow--next"
              (click)="next()"
              aria-label="Next industry"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>

            <!-- Dots -->
            <div class="industries__dots" aria-hidden="true">
              @for (item of allItems(); track item.name; let i = $index) {
                <button
                  class="industries__dot"
                  [class.industries__dot--active]="activeIndex() === i"
                  (click)="setActive(i)"
                  [attr.aria-label]="'Go to ' + item.name"
                ></button>
              }
            </div>
          </div>

          <!-- Right Filters (remaining indices after the left column) -->
          <div class="industries__filters industries__filters--right" role="list">
            @for (item of rightItems(); track item.name; let i = $index) {
              <button
                class="industries__filter"
                [class.industries__filter--active]="activeIndex() === i + leftItems().length"
                (click)="setActive(i + leftItems().length)"
                role="listitem"
                [attr.aria-label]="item.name"
                [attr.aria-pressed]="activeIndex() === i + leftItems().length"
              >
                {{ item.name }}
              </button>
            }
          </div>
        </div>

        <!-- Mobile: filters above and below -->
        <div class="industries__mobile-filters" role="list">
          @for (item of allItems(); track item.name; let i = $index) {
            <button
              class="industries__filter"
              [class.industries__filter--active]="activeIndex() === i"
              (click)="setActive(i)"
              role="listitem"
            >
              {{ item.name }}
            </button>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './industries.component.scss',
})
export class IndustriesComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly Math = Math;

  protected readonly activeIndex = signal(0);

  protected readonly allItems = computed(() => this.i18n.tObjArr('industries.items'));
  protected readonly enItems = computed(() => this.i18n.tEn('industries.items') as any[]);
  protected readonly leftItems = computed(() => {
    const half = Math.ceil(this.allItems().length / 2);
    return this.allItems().slice(0, half);
  });
  protected readonly rightItems = computed(() => {
    const half = Math.ceil(this.allItems().length / 2);
    return this.allItems().slice(half);
  });

  relativePos(index: number): number {
    const total = this.allItems().length;
    let diff = index - this.activeIndex();
    // Wrap for circular feel (limit to ±2 for performance)
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }

  setActive(i: number): void {
    this.activeIndex.set(i);
  }

  next(): void {
    this.activeIndex.update((i) => (i + 1) % this.allItems().length);
  }

  prev(): void {
    this.activeIndex.update((i) => (i - 1 + this.allItems().length) % this.allItems().length);
  }
}
