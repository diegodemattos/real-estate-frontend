import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Allows access to public routes (e.g. /login) only when no valid token exists.
 * Redirects an already-authenticated user to /deals.
 */
export const publicGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isTokenValid()) {
    return true;
  }

  return router.createUrlTree(['/deals']);
};
