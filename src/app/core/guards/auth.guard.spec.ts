import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { SessionService } from '../services/session.service';

describe('authGuard', () => {
  let sessionService: { isTokenValid: jest.Mock };
  let router: { createUrlTree: jest.Mock };

  beforeEach(() => {
    sessionService = { isTokenValid: jest.fn() };
    router = { createUrlTree: jest.fn(() => ({}) as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    });
  });

  function run(): boolean | UrlTree {
    return TestBed.runInInjectionContext(
      () => authGuard({} as any, {} as any) as boolean | UrlTree
    );
  }

  it('allows navigation when the token is valid', () => {
    sessionService.isTokenValid.mockReturnValue(true);
    expect(run()).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to /public/login when the token is invalid', () => {
    sessionService.isTokenValid.mockReturnValue(false);
    run();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/public/login']);
  });
});
