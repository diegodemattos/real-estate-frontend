import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

/**
 * Allows access only when a valid, non-expired token exists in localStorage.
 * Checks SessionService directly so expiry is evaluated at every navigation attempt.
 */
export const authGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.isTokenValid()) {
    return true;
  }

  return router.createUrlTree(['/public/login']);
};
