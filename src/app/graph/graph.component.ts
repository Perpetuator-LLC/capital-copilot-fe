import { Component, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-graph',
  standalone: true,
  // imports: [],
  imports: [NgApexchartsModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;
  // private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // this.isBrowser = isPlatformBrowser(this.platformId);
    this.chartOptions = {
      series: [{
        name: "My-series",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };
  }

  // ngAfterViewInit(): void {
  //   if (this.isBrowser) {
  //     // Initialize or manipulate the chart component here, if necessary
  //   }
  // }
}
