import {Injectable} from '@angular/core';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
  // useFactory: () => provideHttpClient() //withInterceptorsFromDi())
})
export class DataService {
  private url = `http://127.0.0.1:8000/api/`;
  constructor(private http: HttpClient) { }
  fetchData(ticker: string): Observable<any> {
    const body = { ticker }; // Using inputText to set the ticker value dynamically
    return this.http.post<any>(this.url, body);
  }
}
