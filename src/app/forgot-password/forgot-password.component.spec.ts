import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToolbarService } from '../toolbar.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ViewContainerRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let toolbarServiceMock: jasmine.SpyObj<ToolbarService>;
  let viewContainerRefMock: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(async () => {
    // Mock the AuthService, Router, and ToolbarService
    authServiceMock = jasmine.createSpyObj('AuthService', ['forgot', 'getErrors']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    toolbarServiceMock = jasmine.createSpyObj('ToolbarService', ['getViewContainerRef']);
    viewContainerRefMock = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createEmbeddedView']);

    // Make getViewContainerRef return the mocked ViewContainerRef
    toolbarServiceMock.getViewContainerRef.and.returnValue(viewContainerRefMock);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, ForgotPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }, // Use the mocked AuthService
        { provide: Router, useValue: routerMock },
        { provide: ToolbarService, useValue: toolbarServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with an email control and validators', () => {
    const emailControl = component.forgotForm.get('email');
    expect(emailControl).toBeTruthy();
    expect(emailControl?.hasValidator(Validators.required)).toBeTrue();
    expect(emailControl?.hasValidator(Validators.email)).toBeTrue();
  });

  it('should render the toolbar template in ngAfterViewInit', () => {
    fixture.detectChanges();
    expect(toolbarServiceMock.getViewContainerRef).toHaveBeenCalled();
    expect(viewContainerRefMock.clear).toHaveBeenCalled();
    expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledWith(component.toolbarTemplate);
  });

  it('should call authService.forgot and navigate to login on successful submission', () => {
    authServiceMock.forgot.and.returnValue(of({ access: 'dummy-access-token', refresh: 'dummy-refresh-token' }));
    authServiceMock.getErrors.and.returnValue([]);

    component.onSubmit();

    expect(authServiceMock.forgot).toHaveBeenCalledWith(component.forgotForm.value.email as string);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.errors.length).toBe(0);
  });

  it('should handle errors and not navigate on failed submission', () => {
    const errorResponse = 'A special error occurred';
    authServiceMock.forgot.and.returnValue(throwError(() => new Error(errorResponse)));
    authServiceMock.getErrors.and.returnValue([errorResponse]);

    component.onSubmit();

    expect(authServiceMock.forgot).toHaveBeenCalledWith(component.forgotForm.value.email as string);
    expect(routerMock.navigate).not.toHaveBeenCalled();
    for (const error of component.errors) {
      expect(error).toContain(errorResponse);
    }
  });
});
