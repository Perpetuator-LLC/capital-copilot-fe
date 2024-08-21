import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../auth.service';
import { ToolbarService } from '../../toolbar.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toolbarService: jasmine.SpyObj<ToolbarService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    toolbarService = jasmine.createSpyObj('ToolbarService', ['getViewContainerRef', 'clearToolbarComponent']);
    const mockViewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createEmbeddedView']);
    toolbarService.getViewContainerRef.and.returnValue(mockViewContainerRef);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToolbarService, useValue: toolbarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toolbarService = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;

    // Default setup for isLoggedIn method
    authService.isLoggedIn.and.returnValue(true);

    fixture.detectChanges(); // Initialize component view
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should create the toolbar view if the user is logged in', () => {
      const viewContainerRefSpy = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createEmbeddedView']);
      toolbarService.getViewContainerRef.and.returnValue(viewContainerRefSpy);

      component.ngAfterViewInit();

      expect(toolbarService.getViewContainerRef).toHaveBeenCalled();
      expect(viewContainerRefSpy.clear).toHaveBeenCalled();
      expect(viewContainerRefSpy.createEmbeddedView).toHaveBeenCalledWith(component.toolbarTemplate);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call clearToolbarComponent on destroy', () => {
      component.ngOnDestroy();

      expect(toolbarService.clearToolbarComponent).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should render chart components when the user is logged in', () => {
      fixture.detectChanges();

      const earningsTable = fixture.debugElement.query(By.css('app-charts-earnings-table'));
      const candlestickChart = fixture.debugElement.query(By.css('app-charts-candlestick'));

      expect(earningsTable).toBeTruthy();
      expect(candlestickChart).toBeTruthy();
    });

    it('should render the login prompt when the user is not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);
      fixture.detectChanges();

      const loginPrompt = fixture.debugElement.query(By.css('p'));
      expect(loginPrompt.nativeElement.textContent.trim()).toBe('Please login to use the app.');
    });
  });

  describe('handleData method', () => {
    it('should update dataSource when handleData is called', () => {
      const mockData = {
        /* mock chart data */
      };
      component.handleData(mockData);

      expect(component.dataSource).toBe(mockData);
    });
  });
});
