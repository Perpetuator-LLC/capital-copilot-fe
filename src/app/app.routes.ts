import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
    title: 'Home',
  },
  {
    path: 'charts',
    loadComponent: () => import('./charts/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    title: 'Charts',
    canActivate: [AuthGuard],
  },
  {
    path: 'times',
    loadComponent: () => import('./times/times.component').then((c) => c.TimesComponent),
    title: 'Times',
    canActivate: [AuthGuard],
  },
  {
    path: 'valuation',
    loadComponent: () => import('./valuation/valuation.component').then((c) => c.ValuationComponent),
    title: 'Valuation',
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'privacy-policy',
  //   loadComponent: () => import('./privacy-policy/privacy-policy.component').then((c) => c.PrivacyPolicyComponent),
  //   title: 'Privacy Policy',
  // },
  // {
  //   path: 'terms-and-conditions',
  //   loadComponent: () =>
  //     import('./terms-and-conditions/terms-and-conditions.component').then((c) => c.TermsAndConditionsComponent),
  //   title: 'Terms and Conditions',
  // },
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
  {
    path: 'forgot',
    loadComponent: () => import('./forgot-password/forgot-password.component').then((c) => c.ForgotPasswordComponent),
    title: 'Forgot Password',
  },
  {
    path: 'verify',
    loadComponent: () => import('./verify-email/verify-email.component').then((c) => c.VerifyEmailComponent),
    title: 'Verify Email',
  },
  {
    path: 'resend',
    loadComponent: () =>
      import('./resend-verification/resend-verification.component').then((c) => c.ResendVerificationComponent),
    title: 'Resend Verification',
  },
  {
    path: 'reset',
    loadComponent: () => import('./reset-password/reset-password.component').then((c) => c.ResetPasswordComponent),
    title: 'Reset Password',
  },
];

export class AppRoutingModule {}
