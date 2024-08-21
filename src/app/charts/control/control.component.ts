import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ChartData, DataService } from '../../data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CandlestickComponent } from '../candlestick/candlestick.component';
import { Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-charts-control',
  standalone: true,
  imports: [CandlestickComponent, MatInput, AutocompleteComponent, ReactiveFormsModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent implements OnDestroy, OnInit {
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;
  @Output() dataEmitter = new EventEmitter<ChartData>();
  error: string | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.focusInput();
  }

  private focusInput() {
    const input = document.querySelector<HTMLInputElement>('#ticker');
    if (input) {
      input.focus();
    }
  }

  handleSelection(value: string) {
    console.log('Option Selected:', value);
    this.getIt(value);
  }

  handleSubmit(value: string) {
    console.log('Value Submitted:', value);
    this.getIt(value);
  }

  getIt(symbol: string) {
    this.error = null;
    const ticker = symbol.toUpperCase();
    // if (this.stockForm) {
    //   this.stockForm.controls['ticker'].setValue('');
    // }
    // TODO: It appears that GraphQL has a very similar structure of 'data' with 'loading' and 'error' properties.
    //     This could be a good candidate for a shared interface. Let's see if we can refactor this to use that.
    this.dataEmitter.emit({ ticker: ticker, data: { loading: true } });
    this.subscription = this.dataService.fetchData(ticker).subscribe({
      next: (data: ChartData) => {
        this.dataEmitter.emit(data);
      },
      error: (err: { message: string }) => {
        // TODO: Decide which of these to use:
        this.openSnackBar(`Error: ${err.message}`, 'Close');
        this.error = err.message;
        this.dataEmitter.emit({ ticker: ticker, data: { error: err.message } });
      },
      complete: () => {
        console.log('Data fetch complete');
        this.focusInput();
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
