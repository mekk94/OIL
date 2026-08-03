import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

type CardKey = 'vision' | 'mission' | 'values';

interface AccordionCard {
  key: CardKey;
  titleKey: string;
  bodyKey: string;
  image: string;
  isValues?: boolean;
}

const CARDS: AccordionCard[] = [
  { key: 'vision', titleKey: 'overview.vision.title', bodyKey: 'overview.vision.body', image: '/images/overview/vision.png' },
  { key: 'mission', titleKey: 'overview.mission.title', bodyKey: 'overview.mission.body', image: '/images/overview/mission.jpeg' },
  { key: 'values', titleKey: 'overview.values.title', bodyKey: '', image: '/images/overview/values.png', isValues: true },
];

/**
 * One gold icon (SVG path) per core value item, in the same order as
 * overview.values.items in en.json / ar.json. Swap paths freely later.
 */
const VALUE_ICONS: string[] = [
  'M12 2 3 6v6c0 5.25 3.6 9.74 9 11 5.4-1.26 9-5.75 9-11V6l-9-4Z', // Integrity – shield
  'M6 3h12l3 5-9 13L3 8l3-5Zm0 5h12M9 3l3 5 3-5M12 8l-3 10M12 8l3 10', // Quality – gem
  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-9 2 2 4-4', // Safety – shield check
  'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.3v.2h6v-.2c0-.9.4-1.7 1-2.3A6 6 0 0 0 12 3Z', // Innovation – bulb
  'M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm4 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 12h16', // Professionalism – briefcase
  'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm8 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', // Teamwork – people
  'M12 21s-7-4.35-9.5-9C1 8.5 2.5 5 6 5c2 0 3.5 1.5 4 2.5.5-1 2-2.5 4-2.5 3.5 0 5 3.5 3.5 7C19 16.65 12 21 12 21Z', // Customer Commitment – heart
  'M12 22c-4-1-8-5-8-10a8 8 0 0 1 16 0c0 5-4 9-8 10Zm0-6c3-1 5-3.5 5-7', // Sustainability – leaf
];

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="overview" class="overview section--light" aria-label="Company overview">
      <div class="container">
        <div class="section-header" oilReveal>
          <span class="section-label">{{ i18n.t('overview.sectionLabel') }}</span>
          <h2 class="section-heading">{{ i18n.t('overview.heading') }}</h2>
          <p class="section-subhead overview__intro" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'" [innerHTML]="i18n.t('overview.intro')"></p>
        </div>

        <div class="overview__cards" role="list" oilReveal>
          @for (card of cards; track card.key) {
            <div
              class="overview__card"
              [class.overview__card--open]="isCardOpen(card.key)"
              role="listitem"
            >
              <button
                class="overview__card-trigger"
                type="button"
                (click)="toggleCard(card.key)"
                [attr.aria-expanded]="isCardOpen(card.key)"
                [attr.aria-controls]="'card-body-' + card.key"
                [id]="'card-btn-' + card.key"
              >
                <span class="overview__card-header">
                  <span class="overview__card-title" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
                    {{ i18n.t(card.titleKey) }}
                  </span>
                  <span class="overview__card-toggle" aria-hidden="true">
                    <span class="overview__card-toggle-label">{{ isCardOpen(card.key) ? 'Less' : 'More' }}</span>
                    <span class="overview__card-chevron">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </span>
                  </span>
                </span>
              </button>

              <div
                class="overview__card-body"
                [id]="'card-body-' + card.key"
                [attr.aria-labelledby]="'card-btn-' + card.key"
                role="region"
              >
                <div class="overview__card-body-inner">
                  @if (!card.isValues) {
                    <p [dir]="i18n.isArabic() ? 'rtl' : 'ltr'" [innerHTML]="i18n.t(card.bodyKey)"></p>
                  } @else {
                    <ul class="overview__values-list" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'" role="list">
                      @for (val of valueItems(); track val; let vi = $index) {
                        <li class="overview__value-item">
                          <svg class="overview__value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path [attr.d]="valueIcons[vi]" />
                          </svg>
                          <span>{{ val }}</span>
                        </li>
                      }
                    </ul>
                  }
                </div>
              </div>

              <div class="overview__card-media-wrap">
                <span class="overview__card-media" aria-hidden="true">
                  <img [src]="card.image" [alt]="i18n.t(card.titleKey)" loading="lazy" />
                  <span class="overview__card-media-overlay"></span>
                </span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly cards = CARDS;
  protected readonly valueIcons = VALUE_ICONS;

  protected readonly openCards = signal<CardKey[]>([]);

  protected readonly valueItems = computed(() => this.i18n.tArr('overview.values.items'));

  protected isCardOpen(key: CardKey): boolean {
    return this.openCards().includes(key);
  }

  toggleCard(key: CardKey): void {
    this.openCards.update((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }

      return [...current, key];
    });
  }
}