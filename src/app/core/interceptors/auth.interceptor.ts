import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';
import { SKIP_AUTH } from './tokens/skip-auth.token';

/**
 * Attaches the stored access token as a Bearer Authorization header to
 * every outgoing HTTP request.
 *
 * Requests whose context carries `SKIP_AUTH = true` are passed through
 * untouched — the login endpoint uses this so it never sends a stale
 * token while exchanging credentials.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

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
