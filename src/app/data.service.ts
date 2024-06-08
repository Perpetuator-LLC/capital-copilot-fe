import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private url = `http://127.0.0.1:8000/api/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchData(ticker: string | null | undefined): Observable<any> {
    if (!ticker) {
      return new Observable();
    }
    const body = { ticker }; // Using inputText to set the ticker value dynamically
    const token = this.authService.getToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<any>(this.url, body, { headers });
  }
}
