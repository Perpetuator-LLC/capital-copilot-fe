import { Component, inject, OnInit, ViewChild, OnDestroy, ViewContainerRef, ComponentRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Route, RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from '../app.routes';
import { Theme, ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { CookieBannerComponent } from '../cookie-banner/cookie-banner.component';
import { ControlComponent } from '../chart/control/control.component';
import { ToolbarService } from '../toolbar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    CookieBannerComponent,
    NgTemplateOutlet,
    ControlComponent,
  ],
})
export class LayoutComponent implements OnDestroy, OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  rootRoutes = routes.filter((r) => r.path);
  private breakpointObserver = inject(BreakpointObserver);
  protected currentTheme: Theme;
  isLoggedIn = this.authService.isLoggedIn;
  private authRequiredRoutes = ['logout', 'charts', 'times', 'valuation'];

  @ViewChild('toolbarContainer', { read: ViewContainerRef, static: true }) toolbarContainer!: ViewContainerRef;

  constructor(
    protected themeService: ThemeService,
    protected authService: AuthService,
    private toolbarService: ToolbarService,
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    this.toolbarService.setRootViewContainerRef(this.toolbarContainer);
  }

  ngOnDestroy() {
    this.toolbarService.clearToolbarComponent();
  }

  shouldShow(item: Route): boolean {
    if (item.path === 'login') {
      return !this.isLoggedIn();
    } else if (item.path && this.authRequiredRoutes.includes(item.path)) {
      return this.isLoggedIn();
    }
    return true; // default to show all other routes
  }

  logout() {
    this.authService.logout();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  get drawerOpened(): boolean {
    return this.drawer && this.drawer.opened;
  }

  switchTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
  }
}
