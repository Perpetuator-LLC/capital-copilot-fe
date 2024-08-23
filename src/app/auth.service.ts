import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { JWT, Token } from './types';
import { decodeJWT } from './jwt';

export interface RegisterError {
  messages: string[];
}

export interface RegisterResponse {
  detail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private errors: string[] = [];
  private tokenUrl = 'http://127.0.0.1:8000/api/token/';
  private refreshTokenUrl = 'http://127.0.0.1:8000/api/token/refresh/';
  private registerUrl = 'http://127.0.0.1:8000/api/register/';
  private forgotUrl = 'http://127.0.0.1:8000/api/forgot/';
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());
  private loggedInSignal: WritableSignal<boolean> = signal(!this.isRefreshTokenExpired());

  constructor(private http: HttpClient) {}

  forgot(email: string): Observable<RegisterResponse | null> {
    this.errors = [];
    return this.http.post<RegisterResponse>(this.forgotUrl, { email }).pipe(
      tap((response) => this.errors.push(response.detail ? response.detail : 'Password reset email sent')),
      catchError((error) => {
        console.error('Login error:', error);
        Object.keys(error.error).forEach((key) => {
          this.errors.push(`Login error (${key}): ${error.error[key]}`);
        });
        return of(null); // Ensuring that we always return an Observable of the same type
      }),
    );
  }

  login(username: string, password: string): Observable<Token | null> {
    this.errors = [];
    return this.http.post<Token>(this.tokenUrl, { username, password }).pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => {
        console.error('Login error:', error);
        Object.keys(error.error).forEach((key) => {
          this.errors.push(`Login error (${key}): ${error.error[key]}`);
        });
        return of(null); // Ensuring that we always return an Observable of the same type
      }),
    );
  }

  register(username: string, email: string, password: string): Observable<Token | null> {
    this.errors = [];
    return this.http.post<Token>(this.registerUrl, { username, email, password }).pipe(
      tap((response: Token) => this.setSession(response)),
      catchError((error) => {
        console.error('Registration error: ', error);
        Object.keys(error.error).forEach((key) => {
          this.errors.push(`Registration error (${key}): ${error.error[key]}`);
        });
        // this.errors.push('Registration error: ' + JSON.stringify(error.error, null, 2));
        return of(null);
      }),
    );
  }

  getErrors(): string[] {
    return this.errors;
  }

  refreshToken(): Observable<Token | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken || this.isRefreshTokenExpired()) {
      this.logout();
      return of(null);
    }
    return this.http.post<Token>(this.refreshTokenUrl, { refresh: refreshToken }).pipe(
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

    const decodedAccessToken: JWT | null = decodeJWT(accessToken);
    if (decodedAccessToken === null || decodedAccessToken.exp === undefined) {
      console.error('Failed to decode access token');
      return;
    }
    const accessExpiresAt = decodedAccessToken.exp * 1000;

    const decodedRefreshToken: JWT | null = decodeJWT(refreshToken);
    if (decodedRefreshToken === null || decodedRefreshToken.exp === undefined) {
      console.error('Failed to decode refresh token');
      return;
    }
    const refreshExpiresAt = decodedRefreshToken.exp * 1000;

    localStorage.setItem('id_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires_at', JSON.stringify(accessExpiresAt));
    localStorage.setItem('refresh_expires_at', JSON.stringify(refreshExpiresAt));

    this.loggedInSignal.set(!this.isRefreshTokenExpired());
    this.tokenSubject.next(accessToken);
  }

  private updateSession(authResult: Token) {
    const accessToken = authResult.access;
    const decodedAccessToken: JWT | null = decodeJWT(accessToken);
    if (decodedAccessToken === null || decodedAccessToken.exp === undefined) {
      console.error('Failed to decode access token');
      return;
    }
    const accessExpiresAt = decodedAccessToken.exp * 1000;

    localStorage.setItem('id_token', accessToken);
    localStorage.setItem('expires_at', JSON.stringify(accessExpiresAt));

    this.loggedInSignal.set(!this.isRefreshTokenExpired());
    this.tokenSubject.next(accessToken);
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_expires_at');
    this.loggedInSignal.set(false);
    this.tokenSubject.next(null);
  }

  get isLoggedIn(): WritableSignal<boolean> {
    return this.loggedInSignal;
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
    return expiration === null || expiration === undefined || new Date().getTime() >= JSON.parse(expiration);
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
