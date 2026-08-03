import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

// Keys must match the `icon` field of each entry in why.items (en/ar.json).
// Fresh icon set — deliberately different glyphs from every previous
// iteration and from icons used elsewhere on the site (HSE, overview, etc.).
const ICON_SVG: Record<string, string> = {
  // Proven Track Record — target
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  // Expert Team — user-check
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 11 2 2 4-4"/></svg>`,
  // On-Time Delivery — calendar-check
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>`,
  // Cost Efficiency — trending-up
  'dollar-sign': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  // Safety Leadership — shield-check
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  // Full EPC Capability — four-quadrant grid (integrated scope)
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  // Vision 2030 Aligned — compass
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  // Client First — star
  'thumbs-up': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z"/></svg>`,
};

@Component({
  selector: 'app-why-choose',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="why" class="why section--mid-dark" aria-label="Why choose OIL">
      <div class="container">
        <!-- Header -->
        <div class="section-header" oilReveal>
          <span class="section-label">{{ i18n.t('why.sectionLabel') }}</span>
          <h2 class="section-heading">{{ i18n.t('why.heading') }}</h2>
          <p class="section-subhead" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
            {{ i18n.t('why.subhead') }}
          </p>
        </div>

        <!-- Horizontal strip of square cards. Scrolls with snap on narrow
             screens; sits centered inline once everything fits (tablet+). -->
        <div class="why__row" oilReveal role="list">
          @for (item of whyItems(); track item.title) {
            <div class="why__card" role="listitem">
              <span class="why__card-icon" [innerHTML]="getIcon(item.icon)" aria-hidden="true"></span>
              <span class="why__card-name" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">{{ item.title }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './why-choose.component.scss',
})
export class WhyChooseComponent {
  protected readonly i18n = inject(I18nService);
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * SVGs are static, developer-authored strings (never user input), so it's
   * safe to mark them as trusted. Without this, [innerHTML] would run them
   * through Angular's default sanitizer, which strips raw <svg> markup and
   * the icon would render blank.
   */
  private readonly iconCache = new Map<string, SafeHtml>(
    Object.entries(ICON_SVG).map(([key, svg]) => [key, this.sanitizer.bypassSecurityTrustHtml(svg)]),
  );

  protected readonly whyItems = computed(() => this.i18n.tObjArr('why.items'));

  getIcon(key: string): SafeHtml {
    return this.iconCache.get(key) ?? this.iconCache.get('award')!;
  }
}