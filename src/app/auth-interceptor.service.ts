import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private excludedUrls = [
    'http://127.0.0.1:8000/api/token/',
    'http://127.0.0.1:8000/api/token/refresh/'
  ];

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request URL is in the excluded list
    if (this.excludedUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    // console.log('Interceptor hit...');
    if (this.authService.isRefreshTokenExpired()) {
      // console.log('...refresh token expired');
      this.authService.logout();
      this.router.navigate(['/login']);
      return new Observable<HttpEvent<any>>();
    }

    // console.log('...refresh token not expired');
    return from(this.authService.getTokenObservable()).pipe(
      switchMap(token => {
        // console.log('...token:', token);
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        return next.handle(req).pipe(
          catchError(error => {
            if (error.status === 401) {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
            throw error;
          })
        );
      })
    );
  }
}
