import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, switchMap} from 'rxjs';
import { tap } from 'rxjs/operators';

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

  // constructor(private http: HttpClient) {}
  //
  // login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(this.tokenUrl, { username, password }).pipe(
  //     tap(response => this.setSession(response))
  //   );
  // }

  // This method is used to refresh the token using the stored refresh token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(this.refreshTokenUrl, { refresh: refreshToken }).pipe(
      tap(response => this.updateSession(response)),
      catchError(error => {
        this.logout();
        return of(null);
      })
    );
  }

  // Store the access and refresh tokens in localStorage
  private setSession(authResult: any) {
    const accessToken = authResult.access;
    const refreshToken = authResult.refresh;

    // Decode the refresh token to extract expiration time
    const decodedRefreshToken: any = decodeJWT(refreshToken);
    const expiresAt = decodedRefreshToken.exp * 1000; // exp is in seconds, convert to milliseconds

    localStorage.setItem('id_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken); // Storing refresh token
    localStorage.setItem('expires_at', JSON.stringify(expiresAt));

    this.tokenSubject.next(accessToken);
  }

  // Update the access token and expiry in localStorage
  private updateSession(authResult: any) {
    const accessToken = authResult.access;
    const expiresAt = new Date().getTime() + authResult.expires_in * 1000;

    localStorage.setItem('id_token', authResult.access); // Update the access token
    localStorage.setItem('expires_at', JSON.stringify(expiresAt));

    this.tokenSubject.next(accessToken);
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token'); // Ensure refresh token is also cleared
    localStorage.removeItem('expires_at');
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
    if (!this.isLoggedIn()) {
      return this.refreshToken().pipe(
        switchMap(() => of(this.getToken()))
      );
    }
    return this.tokenSubject.asObservable();
  }

  // Method to retrieve the refresh token from localStorage
  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
