import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MotionService } from '../services/motion.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="loader-overlay"
      [class.hidden]="hidden()"
      role="status"
      aria-live="polite"
      [attr.aria-hidden]="hidden()"
      aria-label="Loading OIL website"
    >
      <div class="loader__content">
        <img src="/logo.png" alt="OIL" class="loader__logo" width="72" height="72" />
        <span class="loader__wordmark">OIL</span>
        <div class="loader__bar" aria-hidden="true">
          <div class="loader__bar-fill"></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit {
  protected readonly hidden = signal(false);
  private readonly motion = inject(MotionService);

  ngOnInit(): void {
    const delay = this.motion.prefersReducedMotion() ? 0 : 700;
    setTimeout(() => this.hidden.set(true), delay);
  }
}
