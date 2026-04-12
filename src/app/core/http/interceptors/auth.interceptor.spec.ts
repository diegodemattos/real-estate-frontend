import { TestBed } from '@angular/core/testing';
import {
  HttpContext,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { SessionService } from '../../services/session.service';
import { SKIP_AUTH } from '../tokens/skip-auth.token';

describe('authInterceptor', () => {
  let sessionService: { isTokenValid: jest.Mock; getToken: jest.Mock };
  let next: jest.Mock;

  beforeEach(() => {
    sessionService = {
      isTokenValid: jest.fn(),
      getToken: jest.fn(),
    };
    next = jest.fn((req: HttpRequest<unknown>) => of(req as any));

    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: sessionService }],
    });
  });

  function run(req: HttpRequest<unknown>) {
    return TestBed.runInInjectionContext(() =>
      authInterceptor(req, next as unknown as HttpHandlerFn)
    );
  }

  it('skips the token when SKIP_AUTH context flag is set', (done) => {
    const req = new HttpRequest('GET', '/api/auth/login', {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
    run(req).subscribe(() => {
      expect(sessionService.isTokenValid).not.toHaveBeenCalled();
      const forwarded = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(forwarded.headers.has('Authorization')).toBe(false);
      done();
    });
  });

  it('forwards untouched when no valid token is stored', (done) => {
    sessionService.isTokenValid.mockReturnValue(false);
    const req = new HttpRequest('GET', '/api/deals');
    run(req).subscribe(() => {
      const forwarded = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(forwarded.headers.has('Authorization')).toBe(false);
      done();
    });
  });

  it('attaches the Bearer token when the session is valid', (done) => {
    sessionService.isTokenValid.mockReturnValue(true);
    sessionService.getToken.mockReturnValue('abc.def.ghi');
    const req = new HttpRequest('GET', '/api/deals');
    run(req).subscribe(() => {
      const forwarded = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(forwarded.headers.get('Authorization')).toBe(
        'Bearer abc.def.ghi'
      );
      done();
    });
  });
});
