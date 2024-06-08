import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from "./auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav>
      <a routerLink="/">Home</a> |
      @if (this.authService.isLoggedIn()) {
        <button (click)="logout()">Logout</button>
      } @else {
        <a routerLink="/login">Login</a>
      }
      <router-outlet></router-outlet>
    </nav>
  `,
  // templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'capital-copilot-fe';
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

}
