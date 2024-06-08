import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {LandingComponent} from "./landing/landing.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingComponent },
];

export class AppRoutingModule { }
