import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'charts',
  },
  {
    path: 'charts',
    loadComponent: () => import('./landing/landing.component').then((c) => c.LandingComponent),
    title: 'Charts',
  },
  {
    path: 'times',
    loadComponent: () => import('./times/times.component').then((c) => c.TimesComponent),
    title: 'Times',
  },
  {
    path: 'valuation',
    loadComponent: () => import('./valuation/valuation.component').then((c) => c.ValuationComponent),
    title: 'Valuation',
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then((c) => c.PrivacyPolicyComponent),
    title: 'Privacy Policy',
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () =>
      import('./terms-and-conditions/terms-and-conditions.component').then((c) => c.TermsAndConditionsComponent),
    title: 'Terms and Conditions',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((c) => c.RegisterComponent),
    title: 'Register',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent),
    title: 'Login',
  },
];

export class AppRoutingModule {}
