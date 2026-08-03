import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { SERVICES_CONFIG } from '../../config/services-config';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="services" class="services section--warm" aria-label="Our services">
      <div class="container">
        <div class="section-header" oilReveal>
          <span class="section-label">{{ i18n.t('services.sectionLabel') }}</span>
          <h2 class="section-heading">{{ i18n.t('services.heading') }}</h2>
          <p class="section-subhead" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
            {{ i18n.t('services.subhead') }}
          </p>
        </div>

        <div class="services__grid" oilReveal>
          @for (svc of services; track svc.key) {
            <article class="services__card">
              <img [src]="svc.image" [alt]="i18n.t('services.' + svc.key + '.name')" class="services__card-image" loading="lazy" />
              <div class="services__card-overlay"></div>
              <span class="services__card-name" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
                {{ i18n.t('services.' + svc.key + '.name') }}
              </span>
              <a class="btn btn--gold services__card-btn" [routerLink]="['/services', svc.key]">
                {{ i18n.t('services.viewMore') }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path [attr.d]="i18n.isArabic() ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'"/>
                </svg>
              </a>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly services = SERVICES_CONFIG;
}