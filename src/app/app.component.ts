import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { LoaderComponent } from './core/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoaderComponent],
  template: `
    <app-loader />
    @if (i18n.isLoaded()) {
      <app-header />
      <main id="main-content">
        <router-outlet />
      </main>
      <app-footer />
    }
  `,
})
export class App {
  protected readonly i18n = inject(I18nService);
}