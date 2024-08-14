import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../auth.service';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartComponent } from 'ng-apexcharts';
import { CandlestickComponent } from '../candlestick/candlestick.component';

describe('LandingComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [ChartComponent, CandlestickComponent, DashboardComponent, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
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
    const candlestickGraphComponent = fixture.debugElement.query(By.directive(CandlestickComponent));

    expect(chartComponent).toBeTruthy();
    expect(candlestickGraphComponent).toBeTruthy();
  });

  it('should handle data emitted from chart component', () => {
    authService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const chartComponent = fixture.debugElement.query(By.directive(ChartComponent));
    const testData = { ticker: 'value' };

    chartComponent.triggerEventHandler('dataEmitter', testData);
    fixture.detectChanges();

    expect(component.dataSource).toEqual(testData);
  });

  it('should call handleData when dataEmitter emits data', () => {
    spyOn(component, 'handleData');
    authService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const chartComponent = fixture.debugElement.query(By.directive(ChartComponent));
    const testData = { ticker: 'value' };

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
