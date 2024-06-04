import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";

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
// import {HttpClient, provideHttpClient, withFetch} from "@angular/common/http";
import {DataService} from "../data.service";
import {Subscription} from "rxjs";
import {JsonPipe} from "@angular/common";

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
  imports: [NgApexchartsModule, JsonPipe],
  // providers: [DataService],
  selector: 'app-candlestick-graph',
  // templateUrl: './candlestick-graph.component.html',
  standalone: true,
  styleUrl: './candlestick-graph.component.scss',
  template: `<div>Data: {{ dataSource | json }}</div>`
  // template: `<div>{{ data | json }}</div>`
})
export class CandlestickGraphComponent implements OnChanges {
  // public chartCandleOptions: ChartOptions;
  // public chartBarOptions: ChartOptions;
  @Input() dataSource: any;
  dataSubscription: Subscription | null = null;

  // fetchData(inputText: string) {
  //   const url = 'http://127.0.0.1:8000/data';
  //   const body = { ticker: inputText };
  //   return this.http.post<any>(url, body).subscribe(data => {
  //     // Handle the data
  //   });
  // }

  // constructor(private dataService: DataService) {
  //   // this.chartCandleOptions = {
  //   //   series: [
  //   //     {
  //   //       name: "candle",
  //   //       data: seriesData
  //   //     }
  //   //   ],
  //   //   chart: {
  //   //     type: "candlestick",
  //   //     height: 290,
  //   //     id: "candles",
  //   //     toolbar: {
  //   //       autoSelected: "pan",
  //   //       show: false
  //   //     },
  //   //     zoom: {
  //   //       enabled: false
  //   //     }
  //   //   },
  //   //   plotOptions: {
  //   //     candlestick: {
  //   //       colors: {
  //   //         upward: "#3C90EB",
  //   //         downward: "#DF7D46"
  //   //       }
  //   //     }
  //   //   },
  //   //   xaxis: {
  //   //     type: "datetime"
  //   //   },
  //   //   yaxis: {},
  //   //   dataLabels: {},
  //   //   stroke: {}
  //   // };
  //   //
  //   // this.chartBarOptions = {
  //   //   series: [
  //   //     {
  //   //       name: "volume",
  //   //       data: seriesDataLinear
  //   //     }
  //   //   ],
  //   //   chart: {
  //   //     height: 160,
  //   //     type: "bar",
  //   //     brush: {
  //   //       enabled: true,
  //   //       target: "candles"
  //   //     },
  //   //     selection: {
  //   //       enabled: true,
  //   //       xaxis: {
  //   //         min: new Date("20 Jan 2017").getTime(),
  //   //         max: new Date("10 Dec 2017").getTime()
  //   //       },
  //   //       fill: {
  //   //         color: "#ccc",
  //   //         opacity: 0.4
  //   //       },
  //   //       stroke: {
  //   //         color: "#0D47A1"
  //   //       }
  //   //     }
  //   //   },
  //   //   dataLabels: {
  //   //     enabled: false
  //   //   },
  //   //   plotOptions: {
  //   //     bar: {
  //   //       columnWidth: "80%",
  //   //       colors: {
  //   //         ranges: [
  //   //           {
  //   //             from: -1000,
  //   //             to: 0,
  //   //             color: "#F15B46"
  //   //           },
  //   //           {
  //   //             from: 1,
  //   //             to: 10000,
  //   //             color: "#FEB019"
  //   //           }
  //   //         ]
  //   //       }
  //   //     }
  //   //   },
  //   //   stroke: {
  //   //     width: 0
  //   //   },
  //   //   xaxis: {
  //   //     type: "datetime",
  //   //     axisBorder: {
  //   //       offsetX: 13
  //   //     }
  //   //   },
  //   //   yaxis: {
  //   //     labels: {
  //   //       show: false
  //   //     }
  //   //   }
  //   // };
  //
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      console.log('Data Source changed:', this.dataSource);
    }
  }

  // ngOnDestroy(): void {
  //   this.dataSubscription?.unsubscribe();
  // }
  //
  // ngOnInit(): void {
  //   this.dataSubscription = this.dataService.dataSource.asObservable().subscribe(data => {
  //     this.data = data;
  //   });
  // }
}
