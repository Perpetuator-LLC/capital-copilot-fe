import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data for a given ticker', () => {
    const mockTicker = 'AAPL';
    const mockResponse = {
      data: {
        getChartData: {
          success: true,
          message: 'Data fetched successfully',
          ohlc: [{ x: 1, y: [100, 105, 95, 102] }],
          volume: [{ x: 1, y: 50000 }],
          squeeze: [{ x: 1, y: [98, 101] }],
          kc: [{ x: 1, y: [97, 104] }],
          earnings: [
            {
              symbol: 'AAPL',
              name: 'Apple Inc.',
              reportDate: '2024-08-15',
              fiscalDateEnding: '2024-09-30',
              estimate: 5.0,
              currency: 'USD',
            },
          ],
          ticker: mockTicker,
        },
      },
    };

    service.fetchData(mockTicker).subscribe((response) => {
      expect(response).toEqual(mockResponse.data.getChartData);
    });

    const req = httpMock.expectOne(service['url']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      query: `{
      getChartData(ticker: "AAPL") {
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
    });

    req.flush(mockResponse);
  });
});
