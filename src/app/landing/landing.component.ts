import { Component } from '@angular/core';
import {ChartComponent} from "../chart/chart.component";
import {CandlestickGraphComponent} from "../candlestick-graph/candlestick-graph.component";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ChartComponent, CandlestickGraphComponent],
  template: `
    <h1>Welcome to Capital Copilot!</h1>
    @if (authService.isLoggedIn()) {
      <app-chart (dataEmitter)="handleData($event)"></app-chart>
      <app-candlestick-graph [dataSource]="dataSource"></app-candlestick-graph>
    } @else {
      <p>Please login to use the app.</p>
    }
  `,
  // templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  dataSource: any;

  constructor(public authService: AuthService) {}

  handleData(data: any) {
    this.dataSource = data;
  }
}
