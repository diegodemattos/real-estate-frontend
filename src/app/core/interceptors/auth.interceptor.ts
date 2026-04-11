import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/**
 * Attaches the stored access token as a Bearer Authorization header
 * to every outgoing HTTP request, provided the token exists and is valid.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  if (!tokenService.isTokenValid()) {
    return next(req);
  }

  const token = tokenService.getToken();

  const authenticatedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authenticatedReq);
};
