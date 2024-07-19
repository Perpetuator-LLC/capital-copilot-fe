import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {LandingComponent} from "./landing/landing.component";
import {TimesComponent} from "./times/times.component";
import {ValuationComponent} from "./valuation/valuation.component";

export const routes: Routes = [
  { path: 'times', component: TimesComponent },
  { path: 'valuation', component: ValuationComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingComponent },
];

export class AppRoutingModule { }
