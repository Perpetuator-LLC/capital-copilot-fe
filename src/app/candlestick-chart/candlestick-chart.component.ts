import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter, Optional, ElementRef
} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  NgApexchartsModule,
  ApexTooltip,
  ApexAnnotations, ApexFill, ApexNonAxisChartSeries
} from 'ng-apexcharts';
import { JsonPipe } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  fill: ApexFill;
};

@Component({
  imports: [NgApexchartsModule, JsonPipe],
  selector: 'candlestick-chart',
  standalone: true,
  styleUrls: ['./candlestick-chart.component.scss'],
  templateUrl: './candlestick-chart.component.html',
})
export class CandlestickChartComponent implements OnChanges, AfterViewInit {
  private fullStartDate: number | undefined;
  private zoomStartDate: number | undefined;
  private fullEndDate: number | undefined;
  // private currentZoomStart: number | undefined;
  // private currentZoomEnd: number | undefined;
  @Input() dataSource: any;
  @Output() candleDoubleClicked = new EventEmitter<MouseEvent>();
  @Output() volumeDoubleClicked = new EventEmitter<MouseEvent>();
  @ViewChild('chartScrollbar', { static: false }) scrollbarChart: ChartComponent | undefined;
  @ViewChild('chartCandlePrice', { static: false }) candlePriceChart: ChartComponent | undefined;
  @ViewChild('chartBarVolume', { static: false }) barVolumeChart: ChartComponent | undefined
  @ViewChild('chartSqueeze', { static: false }) squeezeChart: ChartComponent | undefined;
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  public scrollbarOptions: ChartOptions;
  public candlePriceOptions: ChartOptions;
  public barVolumeOptions: ChartOptions;
  public squeezeChartOptions: ChartOptions;

  // TODO: Volume on Price: https://codesandbox.io/s/apx-combo-multiple-yaxis-tz1yc?from-embed=&file=/src/app/app.component.ts

  constructor() {
    this.candlePriceOptions = {
      series: [{ name: 'ohlcSeries', data: [] }],
      annotations: {}, dataLabels: {}, fill: {}, stroke: {},
      chart: {
        id: 'candleChart', type: 'candlestick', height: 480,
        toolbar: { autoSelected: 'pan', show: false, },
        zoom: { enabled: true, },
        animations: { enabled: false, easing: 'easeinout', speed: 80,
          animateGradually: { enabled: true, delay: 10, },
          dynamicAnimation: { enabled: true, speed: 30, }
        },
        events: {
          // wheel: (chart: any, options?: any) => {
          //   console.log('Wheel:', options);
          //
          // },
          // scrolled(chart: any, options?: any) {
          //   if (options?.xaxis?.min && options?.xaxis?.max) {
          //     console.log('Scrolled:', options.xaxis.min, options.xaxis.max);
          //   }
          // },
          click: (event, chartContext, config) => {
            this.handleCandleClick(event);
          },
        },
      },
      tooltip: {
        enabled: true, followCursor: false,
        fixed: { enabled: true, position: 'topLeft', offsetX: 50, },
        custom: function ({series, seriesIndex, dataPointIndex, w}) {
          const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
          const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
          const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
          const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
          return (
            '<div class="apexcharts-tooltip-candlestick">' +
            '<pre>' +
            '<span>Open: ' + o + '</span> | ' +
            '<span>High: ' + h + '</span> | ' +
            '<span>Low: ' + l + '</span> | ' +
            '<span>Close: ' + c + '</span>' +
            '</pre>' +
            '</div>'
          );
        },
      },
      plotOptions: {
        bar: { columnWidth: '85%', },
        candlestick: { colors: { upward: '#3ceb59', downward: '#df4646', }, },
      },
      xaxis: { type: 'datetime', tickPlacement: 'between', crosshairs: { show: true, }, },
      yaxis: { opposite: true, labels: { show: true, align: 'left', }, crosshairs: { show: true, }, }
    };

    this.barVolumeOptions = {
      series: [{ name: 'volumeSeries', data: [] }],
      annotations: {}, fill: {}, tooltip: {},
      chart: {
        id: 'volumeChart', type: 'bar', height: 160,
        toolbar: { autoSelected: 'zoom', show: false, },
        // brush: { enabled: true, targets: ['candles', 'squeeze'], },
        // selection: { enabled: true, },
        zoom: { enabled: true, },
        animations: { enabled: false, easing: 'easeinout', speed: 80,
          animateGradually: { enabled: true, delay: 10, },
          dynamicAnimation: { enabled: true, speed: 30, }
        },
        events: {
          click: (event, chartContext, config) => {
            this.handleVolumeClick(event);
          },
        },
      },
      dataLabels: { enabled: false, },
      plotOptions: {
        bar: {
          columnWidth: '95%', colors: {
          ranges: [ { from: -1000, to: 0, color: '#F15B46', }, { from: 1, to: 10000, color: '#FEB019', }, ],
          },
        },
      },
      stroke: { width: 0, },
      xaxis: { type: 'datetime', axisBorder: { offsetX: 13, }, },
      yaxis: { opposite: true, labels: { show: true, align: 'left', }, }
    };

    this.squeezeChartOptions = {
      series: [{ name: 'squeezeSeries', data: [] }],
      annotations: {}, fill: {}, tooltip: {},
      chart: {
        id: 'squeezeChart', type: 'bar', height: 160,
        toolbar: { autoSelected: 'zoom', show: false, },
        // brush: { enabled: true, target: 'candles', },
        zoom: { enabled: true, },
        animations: {
          enabled: false, easing: 'easeinout', speed: 80,
          animateGradually: { enabled: true, delay: 10, },
          dynamicAnimation: { enabled: true, speed: 30, }
        },
        events: {
          click: (event, chartContext, config) => {
            this.handleVolumeClick(event);
          },
        },
      },
      dataLabels: { enabled: false, },
      plotOptions: {
        bar: {
          columnWidth: '95%',
          colors: {
            ranges: [ { from: -1000, to: 0, color: '#F15B46', }, { from: 1, to: 10000, color: '#FEB019', }, ],
          },
        },
      },
      stroke: { width: 0, },
      xaxis: { type: 'datetime', axisBorder: { offsetX: 13, }, },
      yaxis: { opposite: true, labels: { show: true, align: 'left', }, }
    };

    this.scrollbarOptions = {
      series: [{ name: 'ohlcSeries', data: [] }],
      annotations: {}, dataLabels: {}, plotOptions: {}, stroke: {}, tooltip: {},
      chart: {
        id: 'scrollbarChart', type: 'area', height: 100,
        toolbar: { autoSelected: 'selection', show: false, },
        brush: { targets: ['candleChart', 'volumeChart', 'squeezeChart'], enabled: true },
        selection: { enabled: true, xaxis: {
          min: 0,
          max: 1
          }
        },
        // events: {
        //   click: (event, chartContext, config) => {
        //     this.handleVolumeClick(event);
        //   },
        //   selection: (chartContext, { xaxis, yaxis }) => {
        //     this.currentZoomStart = xaxis.min;
        //     this.currentZoomEnd = xaxis.max;
        //     console.log('Current Zoom Range:', this.currentZoomStart, this.currentZoomEnd);
        //   }
        // },
      },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.91, opacityTo: 0.5, } },
      xaxis: { type: 'datetime', tooltip: { enabled: false } },
      yaxis: { tickAmount: 2, opposite: true }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      console.log('Data Source changed:', this.dataSource);
      this.setDateRange();
      this.updatePriceData();
      this.updateVolumeData();
      this.updateSqueezeData();
      this.updateScrollbarData();
      this.resetZoom();
      // if (this.scrollbarOptions && this.zoomStartDate && this.fullEndDate) {
      //   this.scrollbarOptions.chart.selection = {
      //     enabled: true,
      //     xaxis: {
      //       min: this.zoomStartDate,
      //       max: this.fullEndDate
      //     }
      //   };
      // }
    }
  }

  setDateRange() {
    if (this.dataSource && this.dataSource?.ohlc?.length > 0) {
      const ohlcData = this.dataSource['ohlc'];
      this.fullStartDate = new Date(ohlcData[0].x).getTime();
      this.fullEndDate = new Date(ohlcData[ohlcData.length - 1].x).getTime();
      let startIndex = 0;
      if (this.dataSource['ohlc'].length > 100) {
        startIndex = ohlcData.length - 100;
      }
      this.zoomStartDate = new Date(ohlcData[startIndex].x).getTime();
    }
  }

  getFullStartDate(): number | undefined {
    return this.fullStartDate;
  }

  getFullEndDate(): number | undefined {
    return this.fullEndDate;
  }

  getZoomStartDate(): number | undefined {
    return this.zoomStartDate;
  }

  ngAfterViewInit() {
    // this.resetZoom();
    if (this.scrollbarOptions && this.zoomStartDate && this.fullEndDate) {
      this.scrollbarOptions.chart.selection = {
        enabled: true,
        xaxis: {
          min: this.zoomStartDate,
          max: this.fullEndDate
        }
      };
    }
    // this.attachWheelListener();
  }

  // private attachWheelListener() {
  //   this.chartContainer.nativeElement.addEventListener('wheel', this.handleWheelEvent.bind(this));
  // }
  //
  // handleWheelEvent(event: WheelEvent) {
  //   event.preventDefault(); // Optionally prevent the default scroll behavior
  //   const modifier = 100000000;
  //   const min = this.zoomStartDate;
  //   const max = this.fullEndDate;
  //   // const min = this.scrollbarOptions.chart.selection?.xaxis?.min;
  //   // const max = this.scrollbarOptions.chart.selection?.xaxis?.max;
  //   console.log('Wheel event deltaY:', event.deltaY, 'Min:', min, 'Max:', max);
  //   if (min && max) {
  //     if (event.deltaY > 0) {
  //       console.log('Scrolling down - Zoom out');
  //       let proposedMin = min - event.deltaY * modifier;
  //       if (!this.fullStartDate || proposedMin <= this.fullStartDate) {
  //         proposedMin = this.fullStartDate || 0;
  //       }
  //       this.candlePriceChart?.zoomX(proposedMin, max)
  //     } else {
  //       console.log('Scrolling up - Zoom in');
  //       let proposedMin = min + event.deltaY * modifier;
  //       if (proposedMin >= (max - 10 * modifier)) {
  //         proposedMin = max - 10 * modifier;
  //       }
  //       this.candlePriceChart?.zoomX(proposedMin, max)
  //       // if (this.candlePriceChart && this.zoomStartDate && this.fullEndDate) {
  //       //   this.candlePriceChart.zoomX(this.zoomStartDate, this.fullEndDate);
  //       // }
  //     }
  //   }
  // }
  //
  updatePriceData() {
    this.candlePriceOptions.series = [{ name: 'ohlcSeries', data: (this.dataSource['ohlc'] || []) }]
    // if (this.dataSource && this.dataSource['ohlc']) {
    //   this.candlePriceOptions = {
    //     ...this.candlePriceOptions,
    //     series: [
    //       {
    //         name: 'ohlc',
    //         data: this.dataSource['ohlc'],
    //       },
    //     ],
    //   };
    // } else {
    //   this.candlePriceOptions = {
    //     ...this.candlePriceOptions,
    //     series: [ ],
    //   };
    // }
  }

  updateVolumeData() {
    this.barVolumeOptions.series = [{ name: 'volumeSeries', data: (this.dataSource['volume'] || []) }]
    // if (this.dataSource && this.dataSource['volume']) {
    //   this.barVolumeOptions = {
    //     ...this.barVolumeOptions,
    //     series: [ { name: 'volumeSeries', data: this.dataSource['volume'], }, ],
    //   };
    // } else {
    //   this.barVolumeOptions = {
    //     ...this.barVolumeOptions,
    //     series: [ { name: 'volumeSeries', data: [], }, ],
    //   };
    // }
  }

  updateSqueezeData() {
    this.squeezeChartOptions.series = [{ name: 'squeezeSeries', data: (this.dataSource['squeeze'] || []) }]
    if (this.dataSource && this.dataSource['squeeze']) {
      const annotations: ApexAnnotations = {
        points: []
      };

      this.dataSource['squeeze'].forEach((data: {x: string, y: number[]}) => {
        if (data.y[0] === 0) { // Assuming '1' indicates Squeeze On
          annotations.points?.push({
            x: new Date(data.x).getTime(), y: 0,
            marker: { size: 2, fillColor: '#0C0', shape: 'circle', strokeWidth: 0, },
            // label: { borderColor: '#00FF00', text: 'On' }
          });
        } else if (data.y[0] === 1) { // Assuming '0' indicates Squeeze Off
          annotations.points?.push({
            x: new Date(data.x).getTime(), y: 0,
            marker: { size: 2, fillColor: '#F00', shape: 'circle', strokeWidth: 0, },
            // label: { borderColor: '#FF0000', text: 'Off' }
          });
        }
      });

      this.squeezeChartOptions = {
        ...this.squeezeChartOptions,
        annotations: annotations,
        // series: [ { name: 'squeezeSeries', data: this.dataSource['squeeze'], }, ],
      };
    // } else {
    //   this.squeezeChartOptions = {
    //     ...this.squeezeChartOptions,
    //     series: [{ name: 'squeezeSeries', data: [] }],
    //   };
    }
  }

  updateScrollbarData() {
    this.scrollbarOptions.series = [{ name: 'ohlcSeries', data: (this.dataSource['ohlc'] || []) }]
    // if (this.dataSource && this.dataSource['ohlc']) {
    //   this.scrollbarOptions = {
    //     ...this.scrollbarOptions,
    //     series: [ { name: 'ohlcSeries', data: this.dataSource['ohlc'], }, ],
    //   };
    //   this.scrollbarOptions.chart.selection = { xaxis: { min: this.zoomStartDate, max: this.fullEndDate } };
    // } else {
    //   this.scrollbarOptions = {
    //     ...this.scrollbarOptions,
    //     series: [{ name: 'ohlcSeries', data: [] }],
    //   };
    // }
  }

  handleCandleClick(event: MouseEvent) {
    if (event.detail === 2) { // Double click
      this.resetZoom();
      this.candleDoubleClicked.emit(event);  // Emit the event instead of handling it directly
    }
  }

  resetZoom() {
    if (this.candlePriceChart && this.zoomStartDate && this.fullEndDate) {
      this.candlePriceChart.zoomX(this.zoomStartDate, this.fullEndDate);
    }
    // if (this.barVolumeChart && this.zoomStartDate && this.fullEndDate) {
    //   this.barVolumeChart.zoomX(this.zoomStartDate, this.fullEndDate);
    // }
    // if (this.squeezeChart && this.zoomStartDate && this.fullEndDate) {
    //   this.squeezeChart.zoomX(this.zoomStartDate, this.fullEndDate);
    // }

    // if (this.scrollbarOptions && this.zoomStartDate && this.fullEndDate) {
    //   this.scrollbarOptions.chart.selection = {
    //     enabled: true,
    //     xaxis: {
    //       min: this.zoomStartDate,
    //       max: this.fullEndDate
    //     }
    //   };
    // }

    // if (this.scrollbarChart && this.zoomStartDate && this.fullEndDate) {
    //   this.scrollbarChart.chart.selection = {
    //     enabled: true,
    //     xaxis: {
    //       min: this.zoomStartDate,
    //       max: this.fullEndDate
    //     }
    //   };
    // }

    // if (this.scrollbarChart && this.zoomStartDate && this.fullEndDate) {
    //   this.scrollbarChart.toggleDataPointSelection(this.zoomStartDate, this.fullEndDate);
    //   this.scrollbarChart.updateOptions({
    //     // chart: {
    //       selection: {
    //         xaxis: {
    //           min: this.zoomStartDate,
    //           max: this.fullEndDate
    //         // }
    //       }
    //     }
    //   })
    // }
  }

  handleVolumeClick(event: MouseEvent) {
    if (event.detail === 2) { // Double click
      this.fullZoom();
      this.volumeDoubleClicked.emit(event);  // Emit the event instead of handling it directly
    }
  }

  fullZoom() {
    // if (this.scrollbarChart && this.zoomStartDate && this.fullEndDate) {
    //   this.scrollbarChart.chart.selection = {
    //     enabled: true,
    //     xaxis: {
    //       min: this.zoomStartDate,
    //       max: this.fullEndDate
    //     }
    //   };
    // }
    if (this.candlePriceChart && this.fullStartDate && this.fullEndDate) {
      this.candlePriceChart.zoomX(this.fullStartDate, this.fullEndDate);
    }
    // if (this.barVolumeChart && this.fullStartDate && this.fullEndDate) {
    //   this.barVolumeChart.zoomX(this.fullStartDate, this.fullEndDate);
    // }
    // if (this.squeezeChart && this.fullStartDate && this.fullEndDate) {
    //   this.squeezeChart.zoomX(this.fullStartDate, this.fullEndDate);
    // }
    // if (this.scrollbarOptions && this.zoomStartDate && this.fullEndDate) {
    //   this.scrollbarOptions.chart.selection = {
    //     enabled: true,
    //     xaxis: {
    //       min: this.zoomStartDate,
    //       max: this.fullEndDate
    //     }
    //   };
    // }
  }

}
