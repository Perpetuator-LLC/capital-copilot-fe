import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {of} from "rxjs";

describe('AuthInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        AuthService
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add an Authorization header', () => {
    const mockToken = 'mock-token';
    spyOn(authService, 'getTokenObservable').and.returnValue(of(mockToken));

    httpClient.get('/test').subscribe();

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should not add an Authorization header if the token is not available', () => {
    spyOn(authService, 'getTokenObservable').and.returnValue(of(null));

    httpClient.get('/test').subscribe();

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
  });

  it('should redirect to login if refresh token is expired', () => {
    spyOn(authService, 'isRefreshTokenExpired').and.returnValue(true);
    const navigateSpy = spyOn(router, 'navigate');

    httpClient.get('/test').subscribe();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    httpMock.expectNone('/test'); // No HTTP request should be made
  });

  it('should logout and navigate to login on 401 error', () => {
    const mockToken = 'mock-token';
    spyOn(authService, 'getTokenObservable').and.returnValue(of(mockToken));
    spyOn(authService, 'isRefreshTokenExpired').and.returnValue(false);
    const logoutSpy = spyOn(authService, 'logout');
    const navigateSpy = spyOn(router, 'navigate');

    httpClient.get('/test').subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
