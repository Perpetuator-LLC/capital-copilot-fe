import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from "./auth.service";
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {ThemeService, Theme} from "./theme.service";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatSidenavContainer, MatSidenav, MatTabGroup, MatTab, MatButton, MatIcon, MatFabButton],
  template: `
    <nav>
      <mat-sidenav-container>
        Capital Copilot
        <mat-sidenav>
          Some sidenav content...
        </mat-sidenav>
      </mat-sidenav-container>
      <button mat-fab routerLink="/">
        <mat-icon>home</mat-icon>
        Home
      </button> |
      <button mat-button (click)="switchTheme('light')">Light Theme</button> /
      <button mat-raised-button (click)="switchTheme('dark')">Dark Theme</button> |
      @if (this.authService.isLoggedIn()) {
        <button mat-stroked-button (click)="logout()">Logout</button>
      } @else {
        <a routerLink="/login">Login</a>
      }
    </nav>
    <mat-tab-group>
      <mat-tab label="First"> Content 1 </mat-tab>
      <mat-tab label="Second"> Content 2 </mat-tab>
      <mat-tab label="Third"> Content 3 </mat-tab>
    </mat-tab-group>
    <router-outlet></router-outlet>
  `,
  // templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'capital-copilot-fe';
  constructor(public authService: AuthService, private themeService: ThemeService) {}

  switchTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  logout() {
    this.authService.logout();
  }

}
