import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { MotionService } from '../../core/services/motion.service';
import { STATS_CONFIG } from '../../config/stats-config';

interface StatDisplay {
  key: string;
  value: number;
  suffix: string;
  labelKey: string;
  displayValue: number;
  started: boolean;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stats" aria-label="Company statistics">
      <div class="container stats__grid">
        @for (stat of statsDisplay(); track stat.key) {
          <div class="stats__item" #statEl>
            <span class="stats__number">
              {{ stat.displayValue }}{{ stat.suffix }}
            </span>
            <span class="stats__label" [dir]="i18n.isArabic() ? 'rtl' : 'ltr'">
              {{ i18n.t(stat.labelKey) }}
            </span>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './stats.component.scss',
  host: { '#statsSection': '' },
})
export class StatsComponent implements OnDestroy {
  protected readonly i18n = inject(I18nService);
  private readonly motion = inject(MotionService);

  private animatedValues = signal<Record<string, number>>(
    Object.fromEntries(STATS_CONFIG.map((s) => [s.key, 0]))
  );
  private started = false;
  private observer?: IntersectionObserver;
  private timers: ReturnType<typeof setInterval>[] = [];

  protected readonly statsDisplay = computed(() => {
    const vals = this.animatedValues();
    return STATS_CONFIG.map((s) => ({
      ...s,
      displayValue: vals[s.key] ?? 0,
      started: (vals[s.key] ?? 0) > 0,
    }));
  });

  constructor() {
    // Set up IntersectionObserver via the host element
    setTimeout(() => this.setupObserver());
  }

  private setupObserver(): void {
    const section = document.querySelector('.stats');
    if (!section) return;

    if (this.motion.prefersReducedMotion()) {
      // Just set final values immediately
      const finalVals = Object.fromEntries(STATS_CONFIG.map((s) => [s.key, s.value]));
      this.animatedValues.set(finalVals);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !this.started) {
          this.started = true;
          this.animateCounters();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    this.observer.observe(section);
  }

  private animateCounters(): void {
    const DURATION = 1800;
    const STEPS = 60;
    const STEP_MS = DURATION / STEPS;

    STATS_CONFIG.forEach((stat) => {
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = this.easeOut(step / STEPS);
        const val = Math.round(stat.value * progress);
        this.animatedValues.update((prev) => ({ ...prev, [stat.key]: val }));
        if (step >= STEPS) {
          clearInterval(timer);
          this.animatedValues.update((prev) => ({ ...prev, [stat.key]: stat.value }));
        }
      }, STEP_MS);
      this.timers.push(timer);
    });
  }

  private easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.timers.forEach(clearInterval);
  }
}
