import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { MotionService } from '../services/motion.service';

@Directive({
  selector: '[oilReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input('oilReveal') set directionInput(val: 'up' | 'left' | 'right' | '' | undefined) {
    this.direction = (val === '' || !val) ? 'up' : val;
  }
  direction: 'up' | 'left' | 'right' = 'up';

  @Input() revealThreshold = 0.15;

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private motion = inject(MotionService);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.el.nativeElement;

    // If reduced motion, just show the element
    if (this.motion.prefersReducedMotion()) {
      return;
    }

    // Apply initial hidden class
    const cls = this.direction === 'left' ? 'reveal--left' : this.direction === 'right' ? 'reveal--right' : 'reveal';
    this.renderer.addClass(el, cls);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(el, 'revealed');
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: this.revealThreshold, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
