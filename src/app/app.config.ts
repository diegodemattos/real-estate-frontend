import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { mockInterceptor } from './core/interceptors/mock.interceptor';

/**
 * Interceptor chain composition.
 *
 * Order matters: `authInterceptor` runs first so it can attach the Bearer
 * token, then `mockInterceptor` short-circuits the request with a
 * synthetic response.
 *
 * The mock is only wired in when the environment is non-production so
 * production builds always hit the real backend. Because Angular's
 * `fileReplacements` swaps `environment.ts` for `environment.development.ts`
 * at build time, `environment.production` is a static value the bundler
 * can fold into a constant.
 */
const interceptors: HttpInterceptorFn[] = environment.production
  ? [authInterceptor]
  : [authInterceptor, mockInterceptor];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors(interceptors)),
  ],
};
