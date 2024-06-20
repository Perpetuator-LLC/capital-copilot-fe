import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter
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
  ApexTooltip
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
};

@Component({
  imports: [NgApexchartsModule, JsonPipe],
  selector: 'candlestick-chart',
  standalone: true,
  styleUrls: ['./candlestick-chart.component.scss'],
  templateUrl: './candlestick-chart.component.html',
})
export class CandlestickChartComponent implements OnChanges, AfterViewInit {
  public candlePriceOptions: ChartOptions;
  public barVolumeOptions: ChartOptions;
  private fullStartDate: number | undefined;
  private zoomStartDate: number | undefined;
  private fullEndDate: number | undefined;
  @Input() dataSource: any;
  @Output() candleDoubleClicked = new EventEmitter<MouseEvent>();
  @Output() volumeDoubleClicked = new EventEmitter<MouseEvent>();
  @ViewChild('chartCandlePrice') candlePriceChart: ChartComponent | undefined;
  @ViewChild('chartBarVolume') barVolumeChart: ChartComponent | undefined;

  constructor() {
    this.candlePriceOptions = {
      series: [],
      chart: {
        type: 'candlestick',
        height: 480,
        id: 'candles',
        toolbar: {
          autoSelected: 'zoom',
          show: false,
        },
        zoom: {
          enabled: true,
        },
        events: {
          click: (event, chartContext, config) => {
            this.handleCandleClick(event);
          },
        },
      },
      tooltip: {
        enabled: true,
        followCursor: false,
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
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
        fixed: {
          enabled: true,
          position: 'topLeft',
          offsetX: 50,
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3ceb59',
            downward: '#df4646',
          },
        },
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        opposite: true,
        labels: {
          show: true,
          align: 'left',
        },
      },
      dataLabels: {},
      stroke: {},
    };

    this.barVolumeOptions = {
      series: [],
      chart: {
        height: 160,
        type: 'bar',
        brush: {
          enabled: true,
          target: 'candles',
        },
        selection: {
          enabled: true,
        },
        events: {
          click: (event, chartContext, config) => {
            this.handleVolumeClick(event);
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {

      },
      plotOptions: {
        bar: {
          columnWidth: '80%',
          colors: {
            ranges: [
              {
                from: -1000,
                to: 0,
                color: '#F15B46',
              },
              {
                from: 1,
                to: 10000,
                color: '#FEB019',
              },
            ],
          },
        },
      },
      stroke: {
        width: 0,
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          offsetX: 13,
        },
      },
      yaxis: {
        opposite: true,
        labels: {
          show: true,
          align: 'left',
        },
      },
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      console.log('Data Source changed:', this.dataSource);
      this.updateCandleOptions();
      this.setDateRange();
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
    this.resetZoom();
  }

  updateCandleOptions() {
    if (this.dataSource && this.dataSource['ohlc']) {
      this.candlePriceOptions = {
        ...this.candlePriceOptions,
        series: [
          {
            name: 'candle',
            data: this.dataSource['ohlc'],
          },
        ],
      };
    } else {
      this.candlePriceOptions = {
        ...this.candlePriceOptions,
        series: [ ],
      };
    }

    if (this.dataSource && this.dataSource['volume']) {
      this.barVolumeOptions = {
        ...this.barVolumeOptions,
        series: [
          {
            name: 'volume',
            data: this.dataSource['volume'],
          },
        ],
      };
    } else {
      this.barVolumeOptions = {
        ...this.barVolumeOptions,
        series: [ ],
      };
    }
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
    if (event.detail === 2) { // Double click
      this.fullZoom();
      this.volumeDoubleClicked.emit(event);  // Emit the event instead of handling it directly
    }
  }

  fullZoom() {
    if (this.candlePriceChart && this.fullStartDate && this.fullEndDate) {
      this.candlePriceChart.zoomX(this.fullStartDate, this.fullEndDate);
    }
  }
}
