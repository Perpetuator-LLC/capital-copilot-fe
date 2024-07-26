import { Component, NgModule } from '@angular/core';
import { AuthService } from '../auth.service';
import * as mockData from './mock-data.json';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { ChartData } from '../data.service';
import { ControlComponent } from '../chart/control/control.component';
import { EarningsTableComponent } from '../chart/earnings-table/earnings-table.component';
import { CandlestickComponent } from '../chart/candlestick/candlestick.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ControlComponent,
    CandlestickComponent,
    EarningsTableComponent,
    MatButton,
    MatBadge,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  dataSource: ChartData = mockData;

  constructor(public authService: AuthService) {}

  handleData(data: ChartData) {
    this.dataSource = data;
  }
}
