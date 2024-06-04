import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartComponent } from "./chart/chart.component";
import {CandlestickGraphComponent} from "./candlestick-graph/candlestick-graph.component";
import {DataService} from "./data.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChartComponent, CandlestickGraphComponent],
  template: `
    <app-chart (dataEmitter)="handleData($event)"></app-chart>
    <app-candlestick-graph [dataSource]="dataSource"></app-candlestick-graph>
  `,
  // templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'capital-copilot-fe';
  dataSource: any;
  handleData(data: any) {
    this.dataSource = data;
  }
}
