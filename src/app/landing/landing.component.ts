import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import * as mockData from './mock-data.json';
// import dataSource from "./mock-data.json";
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { ChartData } from '../data.service';
import { ControlComponent } from '../chart/control/control.component';
import { EarningsTableComponent } from '../chart/earnings-table/earnings-table.component';
import { CandlestickComponent } from '../chart/candlestick/candlestick.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ControlComponent,
    CandlestickComponent,
    EarningsTableComponent,
    MatButton,
    MatBadge,
  ],
  template: `
    @if (authService.isLoggedIn()) {
      <app-chart-control (dataEmitter)="handleData($event)"></app-chart-control>
      <app-chart-earnings-table
        [dataSource]="dataSource"
      ></app-chart-earnings-table>
      <app-chart-candlestick [dataSource]="dataSource"></app-chart-candlestick>
    } @else {
      <p>Please login to use the app.</p>
    }
  `,
  // templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  // dataSource: any = {ticker: ""};
  dataSource: ChartData = mockData;

  constructor(public authService: AuthService) {}

  handleData(data: ChartData) {
    this.dataSource = data;
  }
}
