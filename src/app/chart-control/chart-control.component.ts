import {
  Component, EventEmitter, OnDestroy, Output,
} from '@angular/core';
import {DataService} from "../data.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CandlestickChartComponent} from "../candlestick-chart/candlestick-chart.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'chart-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CandlestickChartComponent
  ],
  template: `
    <form [formGroup]="stockForm" (ngSubmit)="onSubmit()">
      <label for="ticker">
        Ticker:
        <input type="text" formControlName="ticker" />
      </label>
      <button type="submit" [disabled]="!stockForm.valid">Go!</button>
    </form>
    @if (error) {
      <div class="error">
        <p>{{ error }}</p>
      </div>
    }
  `,
  styleUrl: './chart-control.component.scss',
})

export class ChartControlComponent implements OnDestroy {
  stockForm = new FormGroup({
    ticker: new FormControl('', Validators.required),
  })
  @Output() dataEmitter = new EventEmitter<any>();
  error: string | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private dataService: DataService
  ) {}

  onSubmit(): void {
    this.error = null;
    if (this.stockForm) {
      const ticker = this.stockForm.value.ticker?.toUpperCase();
      this.stockForm.controls['ticker'].setValue(ticker ? ticker : '');
    }
    this.dataEmitter.emit({ticker: this.stockForm.value.ticker, data: {loading: true}});
    this.subscription = this.dataService.fetchData(this.stockForm.value.ticker).subscribe({
      next: (data) => {
        this.dataEmitter.emit(data);
      },
      error: (err) => {
        // TODO: Decide which of these 2 to use:
        this.error = err.message;
        this.dataEmitter.emit({ ticker: this.stockForm.value.ticker, data: { error: err.message } });
      },
      complete: () => {
        console.log('Data fetch complete');
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
