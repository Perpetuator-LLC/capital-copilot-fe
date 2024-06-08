import {
  Component, EventEmitter, Output,
} from '@angular/core';
import {DataService} from "../data.service";
import {CandlestickGraphComponent} from "../candlestick-graph/candlestick-graph.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CandlestickGraphComponent
  ],
  template: `
    <form [formGroup]="stockForm" (ngSubmit)="onSubmit()">
      <label for="ticker">
        Ticker:
        <input type="text" formControlName="ticker" />
      </label>
      <button type="submit" [disabled]="!stockForm.valid">Go!</button>
    </form>
  `,
  styleUrl: './chart.component.scss',
})

export class ChartComponent {
  stockForm = new FormGroup({
    ticker: new FormControl('', Validators.required),
  })
  // inputText: string = '';
  @Output() dataEmitter = new EventEmitter<any>();

  constructor(
    private dataService: DataService
  ) {}

  onSubmit(): void {
    this.dataService.fetchData(this.stockForm.value.ticker).subscribe(data =>{
      console.log(data);
      this.dataEmitter.emit(data);
    })
  }

}
