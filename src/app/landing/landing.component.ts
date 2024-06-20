import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import {CandlestickChartComponent} from "../candlestick-chart/candlestick-chart.component";
import {ChartControlComponent} from "../chart-control/chart-control.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ChartControlComponent, CandlestickChartComponent],
  template: `
    <h1>Welcome to Capital Copilot!</h1>
    @if (authService.isLoggedIn()) {
      <chart-control (dataEmitter)="handleData($event)"></chart-control>
      <candlestick-chart [dataSource]="dataSource"></candlestick-chart>
    } @else {
      <p>Please login to use the app.</p>
    }
  `,
  // templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  dataSource: any = {ticker: ""};

  constructor(public authService: AuthService) {}

  handleData(data: any) {
    this.dataSource = data;
  }
}

