import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartControlComponent } from './chart-control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ChartComponent', () => {
  let component: ChartControlComponent;
  let fixture: ComponentFixture<ChartControlComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['fetchData']);

    await TestBed.configureTestingModule({
      imports: [ChartControlComponent, ReactiveFormsModule],
      providers: [{ provide: DataService, useValue: dataServiceSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChartControlComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when input is empty', () => {
    expect(component.stockForm.valid).toBeFalsy();
  });

  it('should have a valid form when input is provided', () => {
    component.stockForm.controls['ticker'].setValue('AAPL');
    expect(component.stockForm.valid).toBeTruthy();
  });

  it('should disable the submit button when the form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable the submit button when the form is valid', () => {
    component.stockForm.controls['ticker'].setValue('AAPL');
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should call fetchData and emit data on form submission', () => {
    const testData = { key: 'value' };
    dataService.fetchData.and.returnValue(of(testData));
    spyOn(component.dataEmitter, 'emit');

    component.stockForm.controls['ticker'].setValue('AAPL');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(dataService.fetchData).toHaveBeenCalledWith('AAPL');
    expect(component.dataEmitter.emit).toHaveBeenCalledWith(testData);
  });
});
