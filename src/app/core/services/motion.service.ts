import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MotionService {
  /** True when prefers-reduced-motion: reduce */
  readonly prefersReducedMotion = signal(false);
  readonly animationsEnabled = computed(() => !this.prefersReducedMotion());

  constructor() {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion.set(mql.matches);
    mql.addEventListener('change', (e) => {
      this.prefersReducedMotion.set(e.matches);
    });
  }
}
