import { TestBed } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';
import { I18nService } from '../../core/services/i18n.service';

describe('OverviewComponent', () => {
  const mockI18nService = {
    t: (key: string) => key,
    tArr: (key: string) => (key === 'overview.values.items' ? ['Integrity', 'Quality'] : []),
    isArabic: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [{ provide: I18nService, useValue: mockI18nService }],
    }).compileComponents();
  });

  it('should allow multiple cards to stay open', () => {
    const fixture = TestBed.createComponent(OverviewComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.toggleCard('vision');
    component.toggleCard('mission');

    expect(component.openCards()).toEqual(['vision', 'mission']);

    component.toggleCard('vision');

    expect(component.openCards()).toEqual(['mission']);
  });
});
