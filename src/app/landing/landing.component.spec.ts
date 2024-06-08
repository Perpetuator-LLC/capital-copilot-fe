import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { AuthService } from '../auth.service';
import { ChartComponent } from '../chart/chart.component';
import { CandlestickGraphComponent } from '../candlestick-graph/candlestick-graph.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [ChartComponent, CandlestickGraphComponent, LandingComponent, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login message when not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const loginMessage = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(loginMessage.textContent).toContain('Please login to use the app.');
  });

  it('should display chart and candlestick graph when logged in', () => {
    authService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const chartComponent = fixture.debugElement.query(By.directive(ChartComponent));
    const candlestickGraphComponent = fixture.debugElement.query(By.directive(CandlestickGraphComponent));

    expect(chartComponent).toBeTruthy();
    expect(candlestickGraphComponent).toBeTruthy();
  });

  it('should handle data emitted from chart component', () => {
    authService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const chartComponent = fixture.debugElement.query(By.directive(ChartComponent));
    const testData = { key: 'value' };

    chartComponent.triggerEventHandler('dataEmitter', testData);
    fixture.detectChanges();

    expect(component.dataSource).toEqual(testData);
  });

  it('should call handleData when dataEmitter emits data', () => {
    spyOn(component, 'handleData');
    authService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const chartComponent = fixture.debugElement.query(By.directive(ChartComponent));
    const testData = { key: 'value' };

    chartComponent.triggerEventHandler('dataEmitter', testData);
    fixture.detectChanges();

    expect(component.handleData).toHaveBeenCalledWith(testData);
  });

  it('should initialize with correct state', () => {
    expect(component.dataSource).toBeUndefined();
    expect(component.authService).toBeDefined();
  });

  it('should inject AuthService properly', () => {
    expect(authService).toBeTruthy();
    expect(authService.isLoggedIn).toBeDefined();
  });
});
