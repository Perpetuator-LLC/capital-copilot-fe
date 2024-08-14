import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ChartData {
  success?: boolean;
  data?: { loading?: boolean; error?: string };
  message?: string;
  ohlc?: OHLC[];
  volume?: Volume[];
  kc?: KeltnerChannel[];
  squeeze?: Squeeze[];
  earnings?: EarningsData[];
  ticker?: string;
}

export interface OHLC {
  x: number | string;
  y: number[];
}

export interface Volume {
  x: number | string;
  y: number;
}

export interface KeltnerChannel {
  x: number | string;
  y: number[];
}

export interface Squeeze {
  x: number | string;
  y: number[];
}

export interface EarningsData {
  symbol: string;
  name: string;
  reportDate: Date | string;
  fiscalDateEnding: Date | string;
  estimate: number | null;
  currency: string;
  // daysFromNow: number;
  // color: string;
}

export interface ChartDataResponse {
  errors?: [{ message: string }];
  data?: { getChartData: ChartData };
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private url = `http://127.0.0.1:8000/graphql/`; // Adjusted for the GraphQL endpoint

  constructor(private http: HttpClient) {}

  fetchData(ticker: string | null | undefined): Observable<ChartData | null> {
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
        earnings {
          symbol
          name
          reportDate
          fiscalDateEnding
          estimate
          currency
        }
        ticker
      }
    }`,
    };
    return this.http.post<ChartDataResponse>(this.url, query).pipe(
      map((response: ChartDataResponse) => {
        if (response.errors) {
          throw new Error(response.errors.map((err) => err.message).join(', '));
        }
        const chartData = response.data!.getChartData;
        chartData.ohlc = this.dateStringsToEpoch(chartData.ohlc);
        chartData.squeeze = this.dateStringsToEpoch(chartData.squeeze);
        chartData.kc = this.dateStringsToEpoch(chartData.kc);
        chartData.volume = this.dateStringsToEpoch(chartData.volume);
        return chartData;
      }),
      catchError((error) => {
        console.error('GraphQL query error:', error);
        return throwError(() => new Error('Failed to fetch chart data: ' + error.message));
      }),
    );
  }

  /**
   * Converts the `x` property of each object in the input array from a date string to an epoch timestamp.
   *
   * This function is generic and ensures that the input objects have a property `x` of type `string`.
   * It returns the same objects with the `x` property converted to a `number`, while preserving other properties.
   *
   * @param chartData - An array of objects with at least a string property `x`.
   * @returns An array of objects with the `x` property converted to a number (epoch timestamp).
   *
   * @example
   * const data = [
   *   { x: "2023-01-01T00:00:00Z", y: 10 },
   *   { x: "2023-01-02T00:00:00Z", y: 20 },
   * ];
   * const result = dateStringsToEpoch(data);
   * console.log(result);
   * // Output: [ { x: 1672531200000, y: 10 }, { x: 1672617600000, y: 20 } ]
   */
  private dateStringsToEpoch<T extends { x: string | number }>(
    chartData: T[] | undefined,
  ): (Omit<T, 'x'> & { x: number })[] {
    return chartData
      ? chartData.map((item): Omit<T, 'x'> & { x: number } => {
          return {
            ...item,
            x: new Date(item.x).getTime(),
          };
        })
      : [];
  }
}
