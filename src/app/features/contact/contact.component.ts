import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';
import { CONTACT_INFO } from '../../config/contact-info';
import { RevealDirective } from '../../core/directives/reveal.directive';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="contact section--warm" aria-label="Contact us">
      <div class="container">
        <!-- Header -->
        <div class="section-header" oilReveal>
          <span class="section-label">{{ i18n.t('contact.sectionLabel') }}</span>
          <h2 class="section-heading">{{ i18n.t('contact.heading') }}</h2>
          <p class="section-subhead" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
            {{ i18n.t('contact.subhead') }}
          </p>
        </div>

        <div class="contact__layout" oilReveal>
          <!-- Form -->
          <div class="contact__form-wrap">
            @if (formStatus() === 'success') {
              <div class="contact__success" role="alert" aria-live="polite">
                <div class="contact__success-icon" aria-hidden="true">✓</div>
                <h3>{{ i18n.t('contact.form.successTitle') }}</h3>
                <p>{{ i18n.t('contact.form.successBody') }}</p>
                <button class="btn btn--primary" (click)="resetForm()">
                  {{ i18n.t('contact.form.sendAnother') }}
                </button>
              </div>
            } @else {
              <form
                #contactForm="ngForm"
                class="contact__form"
                (ngSubmit)="submitForm(contactForm)"
                novalidate
                [dir]="i18n.isArabic() ? 'rtl' : 'ltr'"
              >
                <!-- Name -->
                <div class="contact__field">
                  <label for="contact-name" class="contact__label">
                    {{ i18n.t('contact.form.name') }}
                    <span class="contact__required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    class="contact__input"
                    [class.contact__input--error]="errors()?.name"
                    [(ngModel)]="formData.name"
                    [placeholder]="i18n.t('contact.form.namePlaceholder')"
                    autocomplete="name"
                    maxlength="100"
                    required
                    [attr.aria-describedby]="errors()?.name ? 'name-error' : null"
                    [attr.aria-invalid]="!!errors()?.name"
                  />
                  @if (errors()?.name) {
                    <span id="name-error" class="contact__error" role="alert">{{ errors()!.name }}</span>
                  }
                </div>

                <!-- Email -->
                <div class="contact__field">
                  <label for="contact-email" class="contact__label">
                    {{ i18n.t('contact.form.email') }}
                    <span class="contact__required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    class="contact__input"
                    [class.contact__input--error]="errors()?.email"
                    [(ngModel)]="formData.email"
                    [placeholder]="i18n.t('contact.form.emailPlaceholder')"
                    autocomplete="email"
                    maxlength="200"
                    required
                    [attr.aria-describedby]="errors()?.email ? 'email-error' : null"
                    [attr.aria-invalid]="!!errors()?.email"
                  />
                  @if (errors()?.email) {
                    <span id="email-error" class="contact__error" role="alert">{{ errors()!.email }}</span>
                  }
                </div>

                <!-- Phone -->
                <div class="contact__field">
                  <label for="contact-phone" class="contact__label">
                    {{ i18n.t('contact.form.phone') }}
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    class="contact__input"
                    [class.contact__input--error]="errors()?.phone"
                    [(ngModel)]="formData.phone"
                    [placeholder]="i18n.t('contact.form.phonePlaceholder')"
                    autocomplete="tel"
                    maxlength="30"
                    [attr.aria-describedby]="errors()?.phone ? 'phone-error' : null"
                    [attr.aria-invalid]="!!errors()?.phone"
                  />
                  @if (errors()?.phone) {
                    <span id="phone-error" class="contact__error" role="alert">{{ errors()!.phone }}</span>
                  }
                </div>

                <!-- Service -->
                <div class="contact__field">
                  <label for="contact-service" class="contact__label">
                    {{ i18n.t('contact.form.service') }}
                    <span class="contact__required" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    class="contact__input contact__select"
                    [class.contact__input--error]="errors()?.service"
                    [(ngModel)]="formData.service"
                    required
                    [attr.aria-describedby]="errors()?.service ? 'service-error' : null"
                    [attr.aria-invalid]="!!errors()?.service"
                  >
                    <option value="" disabled>{{ i18n.t('contact.form.servicePlaceholder') }}</option>
                    @for (opt of serviceOptions(); track opt) {
                      <option [value]="opt">{{ opt }}</option>
                    }
                  </select>
                  @if (errors()?.service) {
                    <span id="service-error" class="contact__error" role="alert">{{ errors()!.service }}</span>
                  }
                </div>

                <!-- Message -->
                <div class="contact__field contact__field--full">
                  <label for="contact-message" class="contact__label">
                    {{ i18n.t('contact.form.message') }}
                    <span class="contact__required" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    class="contact__input contact__textarea"
                    [class.contact__input--error]="errors()?.message"
                    [(ngModel)]="formData.message"
                    [placeholder]="i18n.t('contact.form.messagePlaceholder')"
                    rows="5"
                    maxlength="2000"
                    required
                    [attr.aria-describedby]="errors()?.message ? 'message-error' : null"
                    [attr.aria-invalid]="!!errors()?.message"
                  ></textarea>
                  @if (errors()?.message) {
                    <span id="message-error" class="contact__error" role="alert">{{ errors()!.message }}</span>
                  }
                </div>

                <!-- Submit -->
                <div class="contact__field contact__field--full contact__submit-wrap">
                  @if (formStatus() === 'error') {
                    <p class="contact__form-error" role="alert" aria-live="polite">
                      {{ i18n.t('contact.form.errorBody') }}
                    </p>
                  }
                  <button
                    type="submit"
                    class="btn btn--primary contact__submit"
                    [disabled]="formStatus() === 'submitting'"
                    [attr.aria-busy]="formStatus() === 'submitting'"
                  >
                    @if (formStatus() === 'submitting') {
                      <span class="contact__spinner" aria-hidden="true"></span>
                    }
                    {{ formStatus() === 'submitting'
                        ? i18n.t('contact.form.submitting')
                        : i18n.t('contact.form.submit') }}
                  </button>
                </div>
              </form>
            }
          </div>

          <!-- Info Cards -->
          <div class="contact__info" oilReveal [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
            <!-- Email -->
            <a [href]="'mailto:' + contactInfo.emails.general" class="contact__info-card">
              <div class="contact__info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <span class="contact__info-label">{{ i18n.t('contact.info.emailLabel') }}</span>
                <span class="contact__info-value">{{ contactInfo.emails.general }}</span>
                <span class="contact__info-value">{{ contactInfo.emails.business }}</span>
              </div>
            </a>

            <!-- Phone -->
            <a [href]="'tel:' + contactInfo.phones.primary" class="contact__info-card">
              <div class="contact__info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <span class="contact__info-label">{{ i18n.t('contact.info.phoneLabel') }}</span>
                <span class="contact__info-value">{{ contactInfo.phones.primary }}</span>
                <span class="contact__info-value">{{ contactInfo.phones.secondary }}</span>
              </div>
            </a>

            <!-- Location -->
            <div class="contact__info-card">
              <div class="contact__info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <span class="contact__info-label">{{ i18n.t('contact.info.locationLabel') }}</span>
                <span class="contact__info-value">
                  {{ i18n.isArabic() ? contactInfo.location.ar : contactInfo.location.en }}
                </span>
              </div>
            </div>

            <!-- WhatsApp CTA -->
            <a
              [href]="'https://wa.me/' + contactInfo.whatsapp.replace('+', '')"
              class="contact__whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              {{ i18n.t('contact.info.whatsappCta') }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly contactInfo = CONTACT_INFO;

  protected formData: ContactForm = { name: '', email: '', phone: '', service: '', message: '' };
  protected readonly formStatus = signal<FormStatus>('idle');
  protected readonly errors = signal<FormErrors | null>(null);

  protected readonly serviceOptions = () => this.i18n.tArr('contact.form.serviceOptions');

  private validate(): FormErrors | null {
    const errs: FormErrors = {};
    const v = this.i18n.t.bind(this.i18n);

    if (!this.formData.name.trim()) errs.name = v('contact.validation.nameRequired');
    else if (this.formData.name.length > 100) errs.name = v('contact.validation.nameMax');

    if (!this.formData.email.trim()) errs.email = v('contact.validation.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email))
      errs.email = v('contact.validation.emailInvalid');

    if (this.formData.phone && !/^[+\d\s\-()]{7,30}$/.test(this.formData.phone))
      errs.phone = v('contact.validation.phoneInvalid');

    if (!this.formData.service) errs.service = v('contact.validation.serviceRequired');

    if (!this.formData.message.trim()) errs.message = v('contact.validation.messageRequired');
    else if (this.formData.message.trim().length < 10)
      errs.message = v('contact.validation.messageMin');
    else if (this.formData.message.length > 2000)
      errs.message = v('contact.validation.messageMax');

    return Object.keys(errs).length ? errs : null;
  }

  async submitForm(form: NgForm): Promise<void> {
    const errs = this.validate();
    this.errors.set(errs);
    if (errs) return;

    this.formStatus.set('submitting');

    try {
      const res = await fetch(this.contactInfo.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone || 'Not provided',
          service: this.formData.service,
          message: this.formData.message,
        }),
      });

      if (res.ok) {
        this.formStatus.set('success');
        form.resetForm();
      } else {
        this.formStatus.set('error');
      }
    } catch {
      this.formStatus.set('error');
    }
  }

  resetForm(): void {
    this.formData = { name: '', email: '', phone: '', service: '', message: '' };
    this.errors.set(null);
    this.formStatus.set('idle');
  }
}
