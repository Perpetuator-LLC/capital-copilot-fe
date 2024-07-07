import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import {CommonModule, DatePipe} from '@angular/common';

export interface EarningsData {
  symbol: string;
  name: string;
  reportDate: Date;
  fiscalDateEnding: Date;
  estimate: number | null;
  currency: string;
  daysFromNow: number;
}

@Component({
  selector: 'earnings-table',
  templateUrl: './earnings-table.component.html',
  styleUrls: ['./earnings-table.component.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
    CommonModule
  ],
})
export class EarningsTableComponent implements OnChanges {
  @Input() dataSource: any;

  displayedColumns: string[] = ['symbol', 'name', 'reportDate', 'fiscalDateEnding', 'estimate', 'currency', 'daysFromNow'];
  earningsData: EarningsData[] = [];

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      console.log('Data Source changed:', this.dataSource);
      this.updateEarnings();
    }
  }

  updateEarnings() {
    const rawData = this.dataSource['earnings']; // <-- comes in here
    const currentDate = new Date();

    this.earningsData = rawData.map((item: any) => {
      const reportDate = new Date(item.reportDate);
      const fiscalDateEnding = new Date(item.fiscalDateEnding);
      const daysFromNow = Math.floor((reportDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...item,
        reportDate,
        fiscalDateEnding,
        daysFromNow
      };
    });
  }
}
