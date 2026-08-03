import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

type VmKey = 'vision' | 'mission';

interface VmCard {
  key: VmKey;
  titleKey: string;
  bodyKey: string;
  image: string;
}

const VM_CARDS: VmCard[] = [
  { key: 'vision', titleKey: 'overview.vision.title', bodyKey: 'overview.vision.body', image: '/images/overview/vision.png' },
  { key: 'mission', titleKey: 'overview.mission.title', bodyKey: 'overview.mission.body', image: '/images/overview/mission.jpeg' },
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

        <!-- Vision & Mission -->
        <div class="overview__vm-grid" oilReveal>
          @for (card of vmCards; track card.key) {
            <article class="overview__vm-card reveal-child" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
              <img class="overview__vm-bg" [src]="card.image" [alt]="i18n.t(card.titleKey)" loading="lazy" />
              <div class="overview__vm-overlay" aria-hidden="true"></div>
              <div class="overview__vm-content">
                <div class="overview__vm-heading-row">
                  <span class="overview__vm-icon" aria-hidden="true">
                    @if (card.key === 'vision') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                    }
                  </span>
                  <h3 class="overview__vm-title">{{ i18n.t(card.titleKey) }}</h3>
                </div>
                <p class="overview__vm-body" [innerHTML]="i18n.t(card.bodyKey)"></p>
              </div>
            </article>
          }
        </div>

        <!-- Core Values -->
        <div class="overview__values" oilReveal>
          <h3 class="overview__values-heading">{{ i18n.t('overview.values.title') }}</h3>
          <ul class="overview__values-grid" role="list">
            @for (val of valueItems(); track val; let vi = $index) {
              <li class="overview__value-card reveal-child">
                <span class="overview__value-icon" aria-hidden="true">
                  @switch (vi) {
                    @case (0) {
                      <!-- Integrity – shield check -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    }
                    @case (1) {
                      <!-- Quality – award -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                        <circle cx="12" cy="8" r="6" />
                      </svg>
                    }
                    @case (2) {
                      <!-- Safety – hard hat -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z" />
                        <path d="M10 10V5a2 2 0 0 1 4 0v5" />
                        <path d="M6 14v-1a6 6 0 0 1 12 0v1" />
                      </svg>
                    }
                    @case (3) {
                      <!-- Innovation – lightbulb -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                      </svg>
                    }
                    @case (4) {
                      <!-- Professionalism – briefcase -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        <rect width="20" height="14" x="2" y="6" rx="2" />
                      </svg>
                    }
                    @case (5) {
                      <!-- Teamwork – users -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    @case (6) {
                      <!-- Customer Commitment – heart -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.35.81-4.5 2.09C10.85 3.81 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                      </svg>
                    }
                    @case (7) {
                      <!-- Sustainability – leaf -->
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                       <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                       <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                     </svg>
                   }
                  }
                  
                </span>
                <span class="overview__value-label">{{ val }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly vmCards = VM_CARDS;
  protected readonly valueItems = computed(() => this.i18n.tArr('overview.values.items'));
}