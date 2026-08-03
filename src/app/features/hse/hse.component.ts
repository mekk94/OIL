import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

// SVG icon map for HSE cards
const HSE_ICONS: Record<string, string> = {
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  'hard-hat': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a2 2 0 0 1 4 0v5"/><path d="M6 14v-1a6 6 0 0 1 12 0v1"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  'book-open': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  'file-check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>`,
  'alert-triangle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
};

@Component({
  selector: 'app-hse',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="hse" class="hse section--light" aria-label="Health, Safety & Environment">
      <div class="container">
        <!-- Header -->
        <div class="section-header" oilReveal>
          <span class="section-label">{{ i18n.t('hse.sectionLabel') }}</span>
          <h2 class="section-heading">{{ i18n.t('hse.heading') }}</h2>
          <p class="section-subhead" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
            {{ i18n.t('hse.subhead') }}
          </p>
        </div>

        <!-- 8-card grid -->
        <div class="hse__grid" oilReveal>
          @for (item of hseItems(); track item.title; let i = $index) {
            <article
              class="hse__card reveal-child"
              [dir]="i18n.isArabic() ? 'rtl' : 'ltr'"
            >
              <div class="hse__card-media">
                <img
                  class="hse__card-icon"
                  [src]="'/images/hse/' + enItems()[i].title + '.jpg'"
                  [alt]="item.title"
                  loading="lazy"
                />
              </div>
              <div class="hse__card-content">
                <h3 class="hse__card-title">{{ item.title }}</h3>
                <p class="hse__card-body">{{ item.body }}</p>
              </div>
              <div class="hse__card-glow" aria-hidden="true"></div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './hse.component.scss',
})
export class HseComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly hseItems = computed(() => this.i18n.tObjArr('hse.items'));
  protected readonly enItems = computed(() => this.i18n.tEn('hse.items') as any[]);

  getIcon(key: string): string {
    return HSE_ICONS[key] ?? HSE_ICONS['shield'];
  }
}
