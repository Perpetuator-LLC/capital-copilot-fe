import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ThemeService, Theme } from './theme.service';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatTabGroup,
    MatTab,
    MatButton,
    MatIcon,
    MatFabButton,
    LayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Capital Copilot';
}
