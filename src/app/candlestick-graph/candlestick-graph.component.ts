import { Component, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke, NgApexchartsModule
} from "ng-apexcharts";

import { seriesData, seriesDataLinear } from "./ohlc";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-candlestick-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './candlestick-graph.component.html',
  styleUrl: './candlestick-graph.component.scss'
})
export class CandlestickGraphComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartCandleOptions: ChartOptions;
  public chartBarOptions: ChartOptions;

  constructor() {
    this.chartCandleOptions = {
      series: [
        {
          name: "candle",
          data: seriesData
        }
      ],
      chart: {
        type: "candlestick",
        height: 290,
        id: "candles",
        toolbar: {
          autoSelected: "pan",
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#3C90EB",
            downward: "#DF7D46"
          }
        }
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {},
      dataLabels: {},
      stroke: {}
    };

    this.chartBarOptions = {
      series: [
        {
          name: "volume",
          data: seriesDataLinear
        }
      ],
      chart: {
        height: 160,
        type: "bar",
        brush: {
          enabled: true,
          target: "candles"
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date("20 Jan 2017").getTime(),
            max: new Date("10 Dec 2017").getTime()
          },
          fill: {
            color: "#ccc",
            opacity: 0.4
          },
          stroke: {
            color: "#0D47A1"
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          columnWidth: "80%",
          colors: {
            ranges: [
              {
                from: -1000,
                to: 0,
                color: "#F15B46"
              },
              {
                from: 1,
                to: 10000,
                color: "#FEB019"
              }
            ]
          }
        }
      },
      stroke: {
        width: 0
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          offsetX: 13
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  }
}
