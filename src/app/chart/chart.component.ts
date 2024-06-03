import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

// export class ChartComponent implements AfterViewInit {
export class ChartComponent implements OnInit {
  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer!: ViewContainerRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

/*
  async ngAfterViewInit() {
    // console.log('ViewContainerRef:', this.chartContainer);
    if (isPlatformBrowser(this.platformId)) {
      const { GraphComponent } = await import('../graph/graph.component');
      // console.log('Dynamically Imported Component:', GraphComponent);
      this.chartContainer.createComponent(GraphComponent);
    }
  }
*/
  async ngOnInit() {
    // Do not load Graphs (APEXCHARTS) for SSR (Server Side Rendering)
    if (isPlatformBrowser(this.platformId)) {
      const { GraphComponent } = await import('../graph/graph.component');
      this.chartContainer.createComponent(GraphComponent);
    }
  }
}
