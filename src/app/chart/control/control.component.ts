import { AfterViewInit, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ChartData, DataService } from '../../data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CandlestickComponent } from '../candlestick/candlestick.component';
import { Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chart-control',
  standalone: true,
  imports: [CandlestickComponent, MatInput, AutocompleteComponent, ReactiveFormsModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent implements OnDestroy, AfterViewInit {
  // stockForm = new FormGroup({
  //   ticker: new FormControl('', Validators.required),
  // });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() dataEmitter = new EventEmitter<any>();
  error: string | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
  ) {}

  ngAfterViewInit(): void {
    this.focusInput();
  }

  private focusInput() {
    const input = document.querySelector<HTMLInputElement>('#ticker');
    if (input) {
      input.focus();
    }
  }

  onAutocompleteSelected(symbol: string) {
    this.error = null;
    const ticker = symbol.toUpperCase();
    // if (this.stockForm) {
    //   this.stockForm.controls['ticker'].setValue('');
    // }
    this.dataEmitter.emit({ ticker: ticker, data: { loading: true } });
    this.subscription = this.dataService.fetchData(ticker).subscribe({
      next: (data: ChartData | null) => {
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
