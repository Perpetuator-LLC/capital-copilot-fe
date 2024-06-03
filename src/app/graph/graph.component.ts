import { Component, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule, ApexTheme
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
};

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
      },
      theme: {
        mode: 'dark',
        palette: 'palette8',
        monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'dark',
          shadeIntensity: 0.65
        },
      }
    };
  }
}
