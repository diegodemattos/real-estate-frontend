import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';

/**
 * Attaches the stored access token as a Bearer Authorization header
 * to every outgoing HTTP request, provided the token exists and is valid.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);

  if (!sessionService.isTokenValid()) {
    return next(req);
  }

  const token = sessionService.getToken();

  const authenticatedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authenticatedReq);
};
