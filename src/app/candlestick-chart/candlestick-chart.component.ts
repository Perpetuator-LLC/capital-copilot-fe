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
        id: 'candleChart', type: 'candlestick', group: 'ticker', height: 480,
        toolbar: { autoSelected: 'pan', show: false, },
        zoom: { enabled: true, type: 'x', autoScaleYaxis: true, },
        animations: { enabled: false, easing: 'easeinout', speed: 80,
          animateGradually: { enabled: true, delay: 10, },
          dynamicAnimation: { enabled: true, speed: 30, }
        },
        events: {
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
        candlestick: { colors: { upward: '#0C0', downward: '#D00', }, },
      },
      xaxis: {
        type: 'datetime', tickPlacement: 'between',
        tooltip: { enabled: true, offsetY: 0, },
        crosshairs: {
          show: true, width: 1, position: 'front',
          stroke: { color: '#b6b6b6', width: 1, dashArray: 3 }
        }
      },
      yaxis: {
        opposite: true, labels: { show: true, align: 'left', },
        tooltip: { enabled: true, },
        crosshairs: {
          show: true, position: 'front',
          stroke: { color: '#b6b6b6', width: 1, dashArray: 3 }
        }
      }
    };

    this.barVolumeOptions = {
      series: [{ name: 'volumeSeries', data: [] }],
      annotations: {}, fill: {}, tooltip: {},
      chart: {
        id: 'volumeChart', type: 'bar', group: 'ticker', height: 160,
        toolbar: { autoSelected: 'zoom', show: false, },
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
        id: 'squeezeChart', type: 'bar', group: 'ticker', height: 160,
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
      yaxis: {
        opposite: true,
        labels: {
          show: true, align: 'left', formatter: function (val: number, opts?: any): string | string[] {
            return val.toFixed(2);
          }
        },
      }
    };

    this.scrollbarOptions = {
      series: [{ name: 'ohlcSeries', data: [] }],
      annotations: {}, dataLabels: {}, plotOptions: {}, stroke: {}, tooltip: {},
      chart: {
        id: 'scrollbarChart', type: 'area', /*group: 'ticker',*/ height: 100,
        toolbar: { autoSelected: 'selection', show: false, },
        brush: { targets: ['candleChart', 'volumeChart', 'squeezeChart'], enabled: true },
        selection: { enabled: true, xaxis: {
          min: 0,
          max: 1
          }
        },
      },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.91, opacityTo: 0.5, } },
      xaxis: { type: 'datetime', tooltip: { enabled: false } },
      yaxis: { tickAmount: 2, opposite: true, labels: { show: false, style: { cssClass: 'fixed-y-axis-label' }, }, },
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
    if (this.scrollbarOptions && this.zoomStartDate && this.fullEndDate) {
      this.scrollbarOptions.chart.selection = {
        enabled: true,
        xaxis: {
          min: this.zoomStartDate,
          max: this.fullEndDate
        }
      };
    }
    document.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });
    // this.attachWheelListener();
  }

  handleScroll(event: WheelEvent) {
    event.preventDefault();
    // @ts-ignore
    const min = this.candlePriceChart?.chartObj.w.globals.minX;
    // @ts-ignore
    const max = this.candlePriceChart?.chartObj.w.globals.maxX;

    var newMinX;
    if (event.deltaY > 0) { // Zoom In
      const increment = (max - min) / 2;
      newMinX = min + increment;
    } else { // Zoom Out
      const increment = (max - min);
      newMinX = min - increment;
    }

    // Constrain within original chart bounds
    // @ts-ignore
    newMinX = Math.max(newMinX, this.candlePriceChart?.chartObj.w.globals.initialMinX);

    // Apply zoom if valid
    if (!isNaN(newMinX) && newMinX < max) {
      this.candlePriceChart?.zoomX(newMinX, max);
    }
  }

  updatePriceData() {
    this.candlePriceOptions.series = [{ name: 'ohlcSeries', data: (this.dataSource['ohlc'] || []) }]
  }

  updateVolumeData() {
    this.barVolumeOptions.series = [{ name: 'volumeSeries', data: (this.dataSource['volume'] || []) }]
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
      };
    }
  }

  updateScrollbarData() {
    this.scrollbarOptions.series = [{ name: 'ohlcSeries', data: (this.dataSource['ohlc'] || []) }]
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
  }

  handleVolumeClick(event: MouseEvent) {
    if (event.detail === 2) {
      this.fullZoom();
      this.volumeDoubleClicked.emit(event);
    }
  }

  fullZoom() {
    if (this.candlePriceChart && this.fullStartDate && this.fullEndDate) {
      this.candlePriceChart.zoomX(this.fullStartDate, this.fullEndDate);
    }
  }

}
