import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { CONTACT_INFO } from '../../config/contact-info';
import { SERVICES_CONFIG } from '../../config/services-config';

const QUICK_LINKS = [
  { key: 'nav.overview', anchor: 'overview' },
  { key: 'nav.services', anchor: 'services' },
  { key: 'nav.industries', anchor: 'industries' },
  { key: 'nav.hse', anchor: 'hse' },
  { key: 'nav.why', anchor: 'why' },
  { key: 'nav.contact', anchor: 'contact' },
];

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer section--dark" role="contentinfo">
      <div class="footer__inner container">
        <!-- Brand -->
        <div class="footer__col footer__col--brand">
          <a [routerLink]="['/']" class="footer__brand-link" aria-label="OIL – Operations Integrated Limited">
            <img src="/logo.png" alt="OIL logo" class="footer__logo" width="64" height="64" />
            <span class="footer__wordmark">OIL</span>
          </a>
          <span class="footer__tagline">{{ i18n.t('footer.tagline') }}</span>
          <p class="footer__desc" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">{{ i18n.t('footer.description') }}</p>

          <div class="footer__social">
            <a [href]="'tel:' + contactInfo.phones.primary" class="footer__social-btn" [attr.aria-label]="i18n.t('footer.phoneAriaLabel')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
            <a [href]="'https://www.google.com/maps/search/?api=1&query=' + contactInfo.location.en" target="_blank" rel="noopener noreferrer" class="footer__social-btn" [attr.aria-label]="i18n.t('footer.mapAriaLabel')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </a>
            <a [href]="'https://wa.me/' + contactInfo.whatsapp.replace('+', '')" target="_blank" rel="noopener noreferrer" class="footer__social-btn" [attr.aria-label]="i18n.t('footer.whatsappAriaLabel')">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </a>
            <button class="footer__social-btn" (click)="scrollToTop()" [attr.aria-label]="i18n.t('footer.backToTopAriaLabel')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m6 15 6-6 6 6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Quick Links -->
        <nav class="footer__col" aria-label="Footer quick links">
          <h3 class="footer__col-heading">{{ i18n.t('footer.quickLinks') }}</h3>
          <ul class="footer__col-list" role="list">
            @for (item of quickLinks; track item.anchor) {
              <li><a [routerLink]="['/']" [fragment]="item.anchor" class="footer__link">{{ i18n.t(item.key) }}</a></li>
            }
          </ul>
        </nav>

        <!-- Services -->
        <nav class="footer__col" aria-label="Footer services">
          <h3 class="footer__col-heading">{{ i18n.t('footer.servicesTitle') }}</h3>
          <ul class="footer__col-list" role="list">
            @for (svc of services; track svc.key) {
              <li><a [routerLink]="['/services', svc.key]" class="footer__link">{{ i18n.t('services.' + svc.key + '.name') }}</a></li>
            }
          </ul>
        </nav>

        <!-- Contact -->
        <div class="footer__col" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
          <h3 class="footer__col-heading">{{ i18n.t('footer.contactUs') }}</h3>
          <ul class="footer__col-list footer__contact-list" role="list">
            <li class="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ i18n.isArabic() ? contactInfo.location.ar : contactInfo.location.en }}</span>
            </li>
            <li class="footer__contact-item">
              <a [href]="'tel:' + contactInfo.phones.primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{{ contactInfo.phones.primary }}</span>
              </a>
            </li>
            <li class="footer__contact-item">
              <a [href]="'mailto:' + contactInfo.emails.general">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>{{ contactInfo.emails.general }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer__bottom">
        <div class="container footer__bottom-inner">
          <span class="footer__copyright">{{ i18n.t('footer.copyright') }}</span>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly contactInfo = CONTACT_INFO;
  protected readonly quickLinks = QUICK_LINKS;
  protected readonly services = SERVICES_CONFIG;

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}