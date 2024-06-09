import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

function createTestJWT(payload: any, expiresIn: number = 3600): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  const encodedHeader = btoa(JSON.stringify(header));
  const iat = Math.floor(Date.now() / 1000);
  payload.iat = payload.iat || iat;
  payload.exp = payload.exp || (iat + expiresIn); // Default expiry: 1 hour
  const encodedPayload = btoa(JSON.stringify(payload));

  // Typically a real JWT would be signed, but for testing we can just concatenate
  // the parts with a fake signature
  return `${encodedHeader}.${encodedPayload}.fake-signature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); // Clear localStorage after each test to avoid conflicts
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set session', () => {
    const accessToken = createTestJWT({});
    const refreshToken = createTestJWT({}, 3600*24);
    const mockResponse = {
      access: accessToken,
      refresh: refreshToken,
      expires_in: 3600
    };

    service.login('testuser', 'testpassword').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('id_token')).toBe(mockResponse.access);
      expect(localStorage.getItem('refresh_token')).toBe(mockResponse.refresh);
      expect(localStorage.getItem('expires_at')).toBeTruthy();
    });

    const req = httpMock.expectOne(service['tokenUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should refresh token and update session', () => {
    const token = createTestJWT({});
    const mockResponse = {
      access: token,
      expires_in: 3600
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'refresh_token') {
        return 'refresh-token';
      }
      return null;
    });

    spyOn(localStorage, 'setItem').and.callThrough();

    service.refreshToken().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.setItem).toHaveBeenCalledWith('id_token', mockResponse.access);
      expect(localStorage.setItem).toHaveBeenCalledWith('expires_at', jasmine.any(String));
    });

    const req = httpMock.expectOne(service['refreshTokenUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear session', () => {
    localStorage.setItem('id_token', 'access-token');
    localStorage.setItem('refresh_token', 'refresh-token');
    localStorage.setItem('expires_at', JSON.stringify(new Date().getTime() + 3600 * 1000));

    service.logout();

    expect(localStorage.getItem('id_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('expires_at')).toBeNull();
  });

  it('should return true if the user is logged in', () => {
    localStorage.setItem('expires_at', JSON.stringify(new Date().getTime() + 3600 * 1000));

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if the user is not logged in', () => {
    localStorage.setItem('expires_at', JSON.stringify(new Date().getTime() - 3600 * 1000));

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return the token if available', () => {
    localStorage.setItem('id_token', 'access-token');

    expect(service.getToken()).toBe('access-token');
  });

  it('should return null if the token is not available', () => {
    localStorage.removeItem('id_token');

    expect(service.getToken()).toBeNull();
  });
});
