import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { API_BASE_URL } from '../../../core/config/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should POST /auth/login with the email mapped to the username field', () => {
    service
      .login({ email: 'admin@termsheet.com', password: 'Ts@123456' })
      .subscribe((response) => {
        expect(response.accessToken).toBe('token');
        expect(response.expiresIn).toBe(3600);
      });

    const req = httpMock.expectOne(`${API_BASE_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'admin@termsheet.com',
      password: 'Ts@123456',
    });
    req.flush({ accessToken: 'token', expiresIn: 3600 });
  });

  it('should GET /auth/me', () => {
    service.getMe().subscribe((user) => {
      expect(user.email).toBe('admin@termsheet.com');
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/auth/me`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'u-1', email: 'admin@termsheet.com' });
  });

  it('should POST /auth/forgot-password with the email body', () => {
    service.requestPasswordRecovery('user@example.com').subscribe();

    const req = httpMock.expectOne(`${API_BASE_URL}/auth/forgot-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@example.com' });
    req.flush(null);
  });
});
