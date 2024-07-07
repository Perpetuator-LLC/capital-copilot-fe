import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import {CandlestickChartComponent} from "../candlestick-chart/candlestick-chart.component";
import {ChartControlComponent} from "../chart-control/chart-control.component";
import * as mockData from './mock-data.json';
// import dataSource from "./mock-data.json";
import {EarningsTableComponent} from "../earnings-table/earnings-table.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ChartControlComponent, CandlestickChartComponent, EarningsTableComponent],
  template: `
    <h1>Welcome to Capital Copilot!</h1>
    @if (authService.isLoggedIn()) {
      <chart-control (dataEmitter)="handleData($event)"></chart-control>
      <earnings-table [dataSource]="dataSource"></earnings-table>
      <candlestick-chart [dataSource]="dataSource"></candlestick-chart>
    } @else {
      <p>Please login to use the app.</p>
    }
  `,
  // templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  // dataSource: any = {ticker: ""};
  dataSource: any = mockData;

  constructor(public authService: AuthService) {}

  handleData(data: any) {
    this.dataSource = data;
  }
}

