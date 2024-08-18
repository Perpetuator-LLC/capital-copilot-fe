import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ChartData, DataService } from '../../data.service';
import { ControlComponent } from './control.component';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { CandlestickComponent } from '../candlestick/candlestick.component';
import { MatInput } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Apollo } from 'apollo-angular';

describe('ControlComponent', () => {
  let component: ControlComponent;
  let fixture: ComponentFixture<ControlComponent>;
  let dataServiceMock: DataService;
  let snackBarMock: MatSnackBar;
  let apolloSpy: jasmine.SpyObj<Apollo>;

  beforeEach(async () => {
    dataServiceMock = jasmine.createSpyObj('DataService', ['fetchData']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const apolloMock = jasmine.createSpyObj('Apollo', ['watchQuery', 'mutate']);
    apolloMock.watchQuery.and.returnValue({ valueChanges: of({ data: {} }) });
    apolloMock.mutate.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        ControlComponent, // Importing the standalone component here
        AutocompleteComponent,
        CandlestickComponent,
        MatInput,
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Apollo, useValue: apolloMock },
      ],
    }).compileComponents();

    apolloSpy = TestBed.inject(Apollo) as jasmine.SpyObj<Apollo>;

    fixture = TestBed.createComponent(ControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should focus the input after view init', () => {
  //   const focusSpy = spyOn(document, 'querySelector').and.returnValue({ focus: jasmine.createSpy('focus') });
  //   component.ngAfterViewInit();
  //   expect(focusSpy).toHaveBeenCalledWith('#ticker');
  //   expect(focusSpy().focus).toHaveBeenCalled();
  // });

  it('should call getIt with uppercase ticker on handleSelection', () => {
    spyOn(component, 'getIt');
    component.handleSelection('abc');
    expect(component.getIt).toHaveBeenCalledWith('abc');
    expect(apolloSpy.query).toHaveBeenCalled();
  });

  it('should call getIt with uppercase ticker on handleSubmit', () => {
    spyOn(component, 'getIt');
    component.handleSubmit('xyz');
    expect(component.getIt).toHaveBeenCalledWith('xyz');
  });

  it('should emit data on successful fetch', () => {
    const mockChartData: ChartData = { ticker: 'XYZ', data: { loading: false } };
    dataServiceMock.fetchData.and.returnValue(of(mockChartData));
    spyOn(component.dataEmitter, 'emit');
    component.getIt('xyz');
    expect(component.dataEmitter.emit).toHaveBeenCalledWith(mockChartData);
  });

  it('should handle errors from data fetch', () => {
    const errorResponse = { message: 'Error fetching data' };
    dataServiceMock.fetchData.and.returnValue(throwError(() => errorResponse));
    spyOn(component.dataEmitter, 'emit');
    component.getIt('error');
    expect(snackBarMock.open).toHaveBeenCalledWith('Error: Error fetching data', 'Close');
    expect(component.dataEmitter.emit).toHaveBeenCalledWith({
      ticker: 'ERROR',
      data: { error: 'Error fetching data' },
    });
  });

  // it('should unsubscribe on destroy', () => {
  //   component.subscription = new Subscription();
  //   spyOn(component.subscription, 'unsubscribe');
  //   component.ngOnDestroy();
  //   expect(component.subscription.unsubscribe).toHaveBeenCalled();
  // });
});
