import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { mockInterceptor } from './core/interceptors/mock.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    // Order matters: auth runs first so it can attach the Bearer token,
    // then mock short-circuits the request with a synthetic response.
    // Swap `mockInterceptor` out when wiring to a real backend.
    provideHttpClient(withInterceptors([authInterceptor, mockInterceptor])),
  ],
};
