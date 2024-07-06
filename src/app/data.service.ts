import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private url = `http://127.0.0.1:8000/graphql/`; // Adjusted for the GraphQL endpoint

  constructor(private http: HttpClient) {}

  fetchData(ticker: string | null | undefined): Observable<any> {
    if (!ticker) {
      return of(null); // Return an Observable emitting `null` if no ticker
    }
    const query = {
      query: `{
      getChartData(ticker: "${ticker}") {
        success
        message
        ohlc {
          x
          y
        }
        volume {
          x
          y
        }
        squeeze {
          x
          y
        }
        kc {
          x
          y
        }
        ticker
      }
    }`
    };
    return this.http.post<any>(this.url, query).pipe(
      map(response => {
        if (response.errors) {
          throw new Error(response.errors.map((err: any) => err.message).join(', '));
        }
        return response.data.getChartData;
      }),
      catchError(error => {
        console.error('GraphQL query error:', error);
        return throwError(() => new Error('Failed to fetch chart data: ' + error.message));
      })
    );
  }
}
