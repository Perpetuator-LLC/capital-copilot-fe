import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'charts',
  },
  {
    path: 'charts',
    loadComponent: () =>
      import('./landing/landing.component').then((c) => c.LandingComponent),
    title: 'Dashboard',
  },
  {
    path: 'times',
    loadComponent: () =>
      import('./times/times.component').then((c) => c.TimesComponent),
    title: 'Times',
  },
  {
    path: 'valuation',
    loadComponent: () =>
      import('./valuation/valuation.component').then(
        (c) => c.ValuationComponent,
      ),
    title: 'Valuation',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
    title: 'Login',
  },
];

export class AppRoutingModule {}
