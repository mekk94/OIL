import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { OverviewComponent } from '../overview/overview.component';
import { StatsComponent } from '../stats/stats.component';
import { ServicesComponent } from '../services/services.component';
import { IndustriesComponent } from '../industries/industries.component';
import { HseComponent } from '../hse/hse.component';
import { WhyChooseComponent } from '../why-choose/why-choose.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    OverviewComponent,
    StatsComponent,
    ServicesComponent,
    IndustriesComponent,
    HseComponent,
    WhyChooseComponent,
    ContactComponent,
  ],
  template: `
    <app-hero />
    <app-overview />
    <app-stats />
    <app-services />
    <app-industries />
    <app-hse />
    <app-why-choose />
    <app-contact />
  `,
})
export class HomeComponent {}