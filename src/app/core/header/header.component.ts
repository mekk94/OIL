import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nService } from '../services/i18n.service';
import { CONTACT_INFO } from '../../config/contact-info';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

const NAV_ITEMS = [
  { key: 'nav.home', anchor: '' },
  { key: 'nav.overview', anchor: 'overview' },
  { key: 'nav.services', anchor: 'services' },
  { key: 'nav.industries', anchor: 'industries' },
  { key: 'nav.hse', anchor: 'hse' },
  { key: 'nav.why', anchor: 'why' },
  { key: 'nav.contact', anchor: 'contact' },
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="header"
      [class.header--scrolled]="isScrolled() || !isHomeRoute()"
      [class.header--menu-open]="menuOpen()"
      role="banner"
    >
      <div class="header__inner container">
        <!-- Logo / Wordmark -->
        <a href="#" class="header__brand" aria-label="OIL – Operations Integrated Limited">
          <img src="/logo.png" alt="OIL logo" class="header__logo" width="48" height="48" />
          <span class="header__wordmark">OIL</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="header__nav" aria-label="Main navigation">
          <ul class="header__nav-list" role="list">
            @for (item of navItems; track item.anchor) {
              <li>
                <a
                  [routerLink]="['/']"
                  [fragment]="item.anchor || undefined"
                  class="header__nav-link"
                  [class.header__nav-link--active]="activeSection() === item.anchor"
                  (click)="closeMenu()"
                >{{ i18n.t(item.key) }}</a>
              </li>
            }
          </ul>
        </nav>

        <!-- Right Actions -->
        <div class="header__actions">
          <!-- Language Toggle -->
          <button
            class="header__lang-btn"
            (click)="toggleLang()"
            [attr.aria-label]="'Switch to ' + (i18n.isArabic() ? 'English' : 'Arabic')"
          >
            <svg class="header__lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span class="header__lang-code">{{ i18n.isArabic() ? 'EN' : 'AR' }}</span>
          </button>

          <!-- CTA – desktop only -->
          <a
            [href]="'mailto:' + contactInfo.emails.general"
            class="btn btn--gold header__cta"
            aria-label="Contact OIL"
          >
            {{ i18n.t('header.cta') }}
          </a>

          <!-- Mobile Hamburger -->
          <button
            class="header__hamburger"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
            aria-controls="mobile-nav"
          >
            <span class="header__hamburger-bar"></span>
            <span class="header__hamburger-bar"></span>
            <span class="header__hamburger-bar"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        id="mobile-nav"
        class="header__mobile-menu"
        [class.header__mobile-menu--open]="menuOpen()"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <ul role="list">
          @for (item of navItems; track item.anchor) {
            <li>
              <a
                [routerLink]="['/']"
                [fragment]="item.anchor"
                class="header__mobile-link"
                (click)="closeMenu()"
              >{{ i18n.t(item.key) }}</a>
            </li>
          }
        </ul>
        <a
          [href]="'mailto:' + contactInfo.emails.general"
          class="btn btn--gold header__mobile-cta"
        >
          {{ i18n.t('header.cta') }}
        </a>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly contactInfo = CONTACT_INFO;
  protected readonly navItems = NAV_ITEMS;
  protected readonly isScrolled = signal(true);
  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal<string>('');

  private readonly router = inject(Router);
  protected readonly isHomeRoute = signal(true);


  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.activeSection.set(event.urlAfterRedirects.startsWith('/services/') ? 'services' : '');
        // Wait a frame so the new route's DOM (or lack of #hero) is actually painted
        requestAnimationFrame(() => this.updateScrollState());
      });

    afterNextRender(() => this.updateScrollState());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateScrollState();

    const scrollPos = window.scrollY + 150;
    let current = '';
    for (const item of this.navItems) {
      if (!item.anchor) continue;
      const el = document.getElementById(item.anchor);
      if (el && scrollPos >= el.offsetTop) current = item.anchor;
    }
    this.activeSection.set(current);
  }

  private updateScrollState(): void {
    const heroEl = document.getElementById('hero');
    this.isScrolled.set(heroEl ? window.scrollY >= heroEl.offsetHeight - 1 : true);
  }

  toggleLang(): void {
    this.i18n.toggleLang();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
