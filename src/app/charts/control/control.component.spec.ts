import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlComponent } from './control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ChartData, DataService } from '../../data.service';
import { Apollo } from 'apollo-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChartComponent', () => {
  let component: ControlComponent;
  let fixture: ComponentFixture<ControlComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['fetchData']);
    const apolloSpy = jasmine.createSpyObj('Apollo', ['watchQuery', 'mutate', 'query']);

    await TestBed.configureTestingModule({
      imports: [ControlComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: Apollo, useValue: apolloSpy }, // Provide the Apollo mock here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should have an invalid form when input is empty', () => {
  //   expect(component.stockForm.valid).toBeFalsy();
  // });

  // it('should have a valid form when input is provided', () => {
  //   component.stockForm.controls['ticker'].setValue('AAPL');
  //   expect(component.stockForm.valid).toBeTruthy();
  // });

  // it('should disable the submit button when the form is invalid', () => {
  //   const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;
  //   expect(submitButton.disabled).toBeTruthy();
  // });

  // it('should enable the submit button when the form is valid', () => {
  //   component.stockForm.controls['ticker'].setValue('AAPL');
  //   fixture.detectChanges();
  //   const submitButton = fixture.debugElement.query(
  //     By.css('button'),
  //   ).nativeElement;
  //   expect(submitButton.disabled).toBeFalsy();
  // });

  it('should call fetchData and emit data on form submission', () => {
    fixture.detectChanges();
    const testData: ChartData = { ticker: 'value' };
    dataService.fetchData.and.returnValue(of(testData));
    spyOn(component.dataEmitter, 'emit');

    component.autocomplete.tickerControl.setValue('AAPL');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(dataService.fetchData).toHaveBeenCalledWith('AAPL');
    expect(component.dataEmitter.emit).toHaveBeenCalledWith(testData);
  });
});
