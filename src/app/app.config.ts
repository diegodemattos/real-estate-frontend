import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/http/interceptors/auth.interceptor';
import { mockInterceptor } from './core/http/interceptors/mock.interceptor';
import { coreFeature } from './core/state/core.feature';
import { CoreEffects } from './core/state/core.effects';

const interceptors: HttpInterceptorFn[] = environment.production
  ? [authInterceptor]
  : [authInterceptor, mockInterceptor];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors(interceptors)),
    provideStore({ [coreFeature.name]: coreFeature.reducer }),
    provideEffects([CoreEffects]),
  ],
};
