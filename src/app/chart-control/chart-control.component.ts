import {
  AfterViewInit,
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
        <input type="text" formControlName="ticker" id="ticker"/>
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

export class ChartControlComponent implements OnDestroy, AfterViewInit {
  stockForm = new FormGroup({
    ticker: new FormControl('', Validators.required),
  })
  @Output() dataEmitter = new EventEmitter<any>();
  error: string | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private dataService: DataService
  ) {}

  ngAfterViewInit(): void {
        this.focusInput();
    }

  onSubmit(): void {
    this.error = null;
    let ticker = this.stockForm?.value.ticker?.toUpperCase();
    if (this.stockForm) {
      this.stockForm.controls['ticker'].setValue('');
    }
    this.dataEmitter.emit({ticker: ticker, data: {loading: true}});
    this.subscription = this.dataService.fetchData(ticker).subscribe({
      next: (data) => {
        this.dataEmitter.emit(data);
      },
      error: (err) => {
        // TODO: Decide which of these 2 to use:
        this.error = err.message;
        this.dataEmitter.emit({ ticker: ticker, data: { error: err.message } });
      },
      complete: () => {
        console.log('Data fetch complete');
        this.focusInput();
      }
    });
  }

  private focusInput() {
    const input = document.querySelector<HTMLInputElement>('#ticker');
    if (input) {
      input.focus();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
