import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

/**
 * Allows access to public routes (e.g. /public/login, /public/password-recovery)
 * only when no valid token exists. Redirects an already-authenticated user
 * to the main deals page.
 */
export const publicGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (!sessionService.isTokenValid()) {
    return true;
  }

  return router.createUrlTree(['/main/deals']);
};
