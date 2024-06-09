import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isRefreshTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return new Observable<HttpEvent<any>>();
    }
    return from(this.authService.getTokenObservable()).pipe(
      switchMap(token => {
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        return next.handle(req).pipe(
          catchError(error => {
            // If there is any other error, handle it accordingly
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
