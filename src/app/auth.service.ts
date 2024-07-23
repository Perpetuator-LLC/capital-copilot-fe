import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

interface Token {
  access: string;
  refresh: string;
  expires_in: number;
}

interface JWT {
  exp: number;
}

// TODO: refactor this function to a utility file
function decodeJWT(token: string): JWT {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenUrl = 'http://127.0.0.1:8000/api/token/';
  private refreshTokenUrl = 'http://127.0.0.1:8000/api/token/refresh/';
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(this.getToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<unknown> {
    return this.http
      .post<Token>(this.tokenUrl, { username, password })
      .pipe(tap((response) => this.setSession(response)));
  }

  refreshToken(): Observable<unknown> {
    // console.log("Refreshing token...");
    const refreshToken = this.getRefreshToken();
    if (!refreshToken || this.isRefreshTokenExpired()) {
      this.logout();
      return of(null);
    }
    return this.http
      .post<Token>(this.refreshTokenUrl, { refresh: refreshToken })
      .pipe(
        tap((response) => this.updateSession(response)),
        catchError((error) => {
          console.debug('Logging out, due to error refreshing token:', error);
          this.logout();
          return of(null);
        }),
      );
  }

  private setSession(authResult: Token) {
    const accessToken = authResult.access;
    const refreshToken = authResult.refresh;

    const decodedAccessToken: JWT = decodeJWT(accessToken);
    const accessExpiresAt = decodedAccessToken.exp * 1000;
    // console.log('Access Token Expiry:', new Date(accessExpiresAt));

    const decodedRefreshToken: JWT = decodeJWT(refreshToken);
    const refreshExpiresAt = decodedRefreshToken.exp * 1000;
    // console.log('Refresh Token Expiry:', new Date(refreshExpiresAt));

    localStorage.setItem('id_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires_at', JSON.stringify(accessExpiresAt));
    localStorage.setItem(
      'refresh_expires_at',
      JSON.stringify(refreshExpiresAt),
    );

    this.tokenSubject.next(accessToken);
  }

  private updateSession(authResult: Token) {
    const accessToken = authResult.access;
    const decodedAccessToken: JWT = decodeJWT(accessToken);
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
    // console.log('Logged out');
    this.tokenSubject.next(null);
  }

  public isLoggedIn(): boolean {
    return !this.isRefreshTokenExpired();
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
    return this.refreshToken().pipe(switchMap(() => of(this.getToken())));
  }

  private isTokenExpired(): boolean {
    const expiration = localStorage.getItem('expires_at');
    return (
      expiration === null ||
      expiration === undefined ||
      new Date().getTime() >= JSON.parse(expiration)
    );
  }

  public isRefreshTokenExpired(): boolean {
    const refreshExpiration = localStorage.getItem('refresh_expires_at');
    return (
      refreshExpiration === null ||
      refreshExpiration === undefined ||
      new Date().getTime() >= JSON.parse(refreshExpiration)
    );
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
