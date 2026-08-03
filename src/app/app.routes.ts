import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ServiceDetailComponent } from './features/service-detail/service-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services/:key', component: ServiceDetailComponent },
  { path: '**', redirectTo: '' },
];