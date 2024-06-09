import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

// TODO: refactor this function to a utility file
function decodeJWT(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenUrl = 'http://127.0.0.1:8000/api/token/';
  private refreshTokenUrl = 'http://127.0.0.1:8000/api/token/refresh/';
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.tokenUrl, { username, password }).pipe(
      tap(response => this.setSession(response))
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken || this.isRefreshTokenExpired()) {
      this.logout();
      return of(null);
    }
    return this.http.post<any>(this.refreshTokenUrl, { refresh: refreshToken }).pipe(
      tap(response => this.updateSession(response)),
      catchError(error => {
        this.logout();
        return of(null);
      })
    );
  }

  private setSession(authResult: any) {
    const accessToken = authResult.access;
    const refreshToken = authResult.refresh;

    const decodedAccessToken: any = decodeJWT(accessToken);
    const accessExpiresAt = decodedAccessToken.exp * 1000;

    const decodedRefreshToken: any = decodeJWT(refreshToken);
    const refreshExpiresAt = decodedRefreshToken.exp * 1000;

    localStorage.setItem('id_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires_at', JSON.stringify(accessExpiresAt));
    localStorage.setItem('refresh_expires_at', JSON.stringify(refreshExpiresAt));

    this.tokenSubject.next(accessToken);
  }

  private updateSession(authResult: any) {
    const accessToken = authResult.access;
    const decodedAccessToken: any = decodeJWT(accessToken);
    const accessExpiresAt = decodedAccessToken.exp * 1000;

    localStorage.setItem('id_token', accessToken);
    localStorage.setItem('expires_at', JSON.stringify(accessExpiresAt));

    this.tokenSubject.next(accessToken);
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_expires_at');
    this.tokenSubject.next(null);
  }

  public isLoggedIn(): boolean {
    const expiration = localStorage.getItem('expires_at');
    return expiration !== null && new Date().getTime() < JSON.parse(expiration);
  }

  public getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  public getTokenObservable(): Observable<string | null> {
    const token = this.getToken();
    if (this.isRefreshTokenExpired()) {
      this.logout();
      return of(null);
    } else if (token && !this.isTokenExpired()) {
      return of(token);
    }
    return this.refreshToken().pipe(
      switchMap(() => of(this.getToken()))
    );
  }

  private isTokenExpired(): boolean {
    const expiration = localStorage.getItem('expires_at');
    return expiration !== null && new Date().getTime() >= JSON.parse(expiration);
  }

  public isRefreshTokenExpired(): boolean {
    const refreshExpiration = localStorage.getItem('refresh_expires_at');
    return refreshExpiration !== null && new Date().getTime() >= JSON.parse(refreshExpiration);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
