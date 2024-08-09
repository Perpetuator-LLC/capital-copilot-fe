import { Component, TemplateRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { ChartData } from '../data.service';
import { ControlComponent } from '../chart/control/control.component';
import { EarningsTableComponent } from '../chart/earnings-table/earnings-table.component';
import { CandlestickComponent } from '../chart/candlestick/candlestick.component';
import { LayoutComponent } from '../layout/layout.component';
import { NgTemplateOutlet } from '@angular/common';
import { ToolbarService } from '../toolbar.service';
import dataSource from './mock-data.json';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ControlComponent,
    CandlestickComponent,
    EarningsTableComponent,
    MatButton,
    MatBadge,
    LayoutComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  dataSource: ChartData = dataSource;
  isLoggedIn = this.authService.isLoggedIn;
  @ViewChild('toolbarTemplate', { static: true }) toolbarTemplate!: TemplateRef<any>;

  constructor(
    public authService: AuthService,
    private toolbarService: ToolbarService,
  ) {}

  ngAfterViewInit() {
    if (this.isLoggedIn()) {
      const viewContainerRef = this.toolbarService.getViewContainerRef();
      viewContainerRef.clear();
      viewContainerRef.createEmbeddedView(this.toolbarTemplate);
    }
  }

  ngOnDestroy() {
    this.toolbarService.clearToolbarComponent();
  }

  handleData(data: ChartData) {
    this.dataSource = data;
  }
}
