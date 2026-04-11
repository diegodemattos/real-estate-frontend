import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { publicGuard } from './public.guard';
import { SessionService } from '../services/session.service';

describe('publicGuard', () => {
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
      () => publicGuard({} as any, {} as any) as boolean | UrlTree
    );
  }

  it('allows navigation when no valid token exists', () => {
    sessionService.isTokenValid.mockReturnValue(false);
    expect(run()).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to /main/deals when a valid token exists', () => {
    sessionService.isTokenValid.mockReturnValue(true);
    run();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/main/deals']);
  });
});
