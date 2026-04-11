import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Allows access only when a valid, non-expired token exists in localStorage.
 * Checks TokenService directly so expiry is evaluated at every navigation attempt.
 */
export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isTokenValid()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
