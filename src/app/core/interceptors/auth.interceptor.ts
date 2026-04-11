import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';
import { SKIP_AUTH } from './tokens/skip-auth.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const sessionService = inject(SessionService);
  if (!sessionService.isTokenValid()) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${sessionService.getToken()}` },
    })
  );
};
