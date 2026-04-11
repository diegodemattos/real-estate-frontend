import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

/**
 * Allows access to public routes (e.g. /login) only when no valid token exists.
 * Redirects an already-authenticated user to /deals.
 */
export const publicGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (!sessionService.isTokenValid()) {
    return true;
  }

  return router.createUrlTree(['/deals']);
};
