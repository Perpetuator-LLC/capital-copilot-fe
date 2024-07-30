import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import * as mockData from './mock-data.json';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { ChartData } from '../data.service';
import { ControlComponent } from '../chart/control/control.component';
import { EarningsTableComponent } from '../chart/earnings-table/earnings-table.component';
import { CandlestickComponent } from '../chart/candlestick/candlestick.component';
import { LayoutComponent } from '../layout/layout.component';
import { NgTemplateOutlet } from '@angular/common';
import { ToolbarService } from '../toolbar.service';

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
export class LandingComponent implements OnInit, OnDestroy {
  dataSource: ChartData = mockData;
  isLoggedIn = this.authService.isLoggedIn;
  @ViewChild('toolbarTemplate', { static: true }) toolbarContent!: TemplateRef<any>;

  constructor(
    public authService: AuthService,
    private toolbarService: ToolbarService,
  ) {}

  ngOnInit() {
    if (this.isLoggedIn()) {
      const componentRef = this.toolbarService.setToolbarComponent(ControlComponent);
      if (componentRef) {
        componentRef.instance.dataEmitter.subscribe((data: any) => this.handleData(data));
      }
    }
  }

  ngOnDestroy() {
    this.toolbarService.clearToolbarComponent();
  }

  handleData(data: ChartData) {
    this.dataSource = data;
  }
}
