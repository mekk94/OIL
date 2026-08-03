import { ChangeDetectionStrategy, Component, HostListener, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { SERVICES_CONFIG, ServiceKey, SUBSERVICE_IMAGES } from '../../config/services-config';

interface SubService {
  name: string;
  description: string;
}

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="service-detail section--light" aria-labelledby="service-detail-heading">
      <div class="container">
        <div class="service-detail__header" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
          <a routerLink="/" fragment="services" class="btn btn--ghost service-detail__back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path [attr.d]="i18n.isArabic() ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'"/>
            </svg>
            {{ i18n.t('services.backBtn') }}
          </a>
          <h1 id="service-detail-heading" class="service-detail__heading">
            {{ i18n.t('services.' + serviceKey() + '.pageTitle') }}
          </h1>
        </div>

        <div class="service-detail__grid">
          @for (sub of subServices(); track sub.name; let i = $index) {
            <button class="service-detail__card" (click)="open(i)">
              <div class="service-detail__card-image" aria-hidden="true">
                <img [src]="images()[i]" [alt]="sub.name" loading="lazy" />
              </div>
              <div class="service-detail__card-overlay"></div>
              <span class="service-detail__card-name" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">{{ sub.name }}</span>
            </button>
          }
        </div>
      </div>

      @if (selected(); as sub) {
        <div class="service-detail__modal-backdrop" (click)="close()">
          <div
            class="service-detail__modal"
            role="dialog"
            aria-modal="true"
            [attr.aria-label]="sub.name"
            (click)="$event.stopPropagation()"
          >
            <button class="service-detail__modal-close" (click)="close()" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
            <div class="service-detail__modal-image" aria-hidden="true">
              <img [src]="images()[selectedIndex()!]" [alt]="sub.name" />
            </div>
            <div class="service-detail__modal-body" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
              <h3>{{ sub.name }}</h3>
              <p>{{ sub.description }}</p>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent {
  protected readonly i18n = inject(I18nService);

  /** Bound automatically from the :key route param via withComponentInputBinding() */
  readonly key = input<string>('civil');

  protected readonly serviceKey = computed<ServiceKey>(() =>
    SERVICES_CONFIG.some((s) => s.key === this.key()) ? (this.key() as ServiceKey) : 'civil',
  );

  protected readonly images = computed(() => SUBSERVICE_IMAGES[this.serviceKey()] ?? []);
  protected readonly subServices = computed<SubService[]>(() =>
    this.i18n.tObjArr(`services.${this.serviceKey()}.items`),
  );

  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly selected = computed(() => {
    const i = this.selectedIndex();
    return i === null ? null : (this.subServices()[i] ?? null);
  });

  open(index: number): void {
    this.selectedIndex.set(index);
  }

  close(): void {
    this.selectedIndex.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}