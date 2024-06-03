import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandlestickGraphComponent } from './candlestick-graph.component';

describe('CandlestickGraphComponent', () => {
  let component: CandlestickGraphComponent;
  let fixture: ComponentFixture<CandlestickGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandlestickGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandlestickGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
