import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register', 'getErrors']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.register when the form is valid and submitted', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const mockToken = {
      access: 'access-token',
      refresh: 'refresh-token',
    };
    mockAuthService.register.and.returnValue(of(mockToken));
    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/charts']);
  });

  it('should display an error when registration fails', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const mockError = 'Registration failed: mock error';
    mockAuthService.register.and.returnValue(throwError(() => new Error(mockError)));
    mockAuthService.getErrors.and.returnValue([mockError]);
    component.onSubmit();
    for (const error of component.errors) {
      expect(error).toContain(mockError);
    }
  });

  it('should not call AuthService.register if the form is invalid', () => {
    // Arrange
    component.registerForm.setValue({
      username: '',
      email: 'invalid-email',
      password: '123',
    });
    component.onSubmit();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });
});
