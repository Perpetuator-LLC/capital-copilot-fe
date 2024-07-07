import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {DatePipe, JsonPipe} from '@angular/common';
import {MatTableModule} from "@angular/material/table";
import {MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatTooltipModule} from "@angular/material/tooltip";

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
  imports: [JsonPipe, MatTableModule, DatePipe, MatAccordion, MatExpansionPanel, MatExpansionPanelTitle,
    MatExpansionModule, MatTooltipModule],

  selector: 'earnings-table',
  standalone: true,
  styleUrls: ['./earnings-table.component.scss'],
  templateUrl: './earnings-table.component.html',
})

export class EarningsTableComponent implements OnChanges {
  @Input() dataSource: any;

  displayedColumns: string[] = ['symbol', 'name', 'reportDate', 'fiscalDateEnding', 'estimate', 'currency', 'daysFromNow'];
  earningsData: EarningsData[] = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      console.log('Data Source changed:', this.dataSource);
      this.updateEarnings();
    }
  }

  updateEarnings() {
    const rawData = this.dataSource['earnings'];
    const currentDate = new Date();

    this.earningsData = rawData.map((item: any) => {
      const reportDate = new Date(item.reportDate);
      const fiscalDateEnding = new Date(item.fiscalDateEnding);
      const daysFromNow = Math.floor((reportDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const color = daysFromNow < 30 ? 'red' : (daysFromNow < 60 ? 'yellow' : 'green');

      return {
        ...item,
        reportDate,
        fiscalDateEnding,
        daysFromNow,
        color
      };
    });
  }
}
