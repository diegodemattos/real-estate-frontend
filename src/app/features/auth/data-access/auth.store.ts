import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from './auth.service';
import { AuthUser, LoginCredentials } from '../models/auth.model';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  // Factory runs in an injection context so the user signal is already
  // hydrated from the persisted token before the first component reads it.
  withState<AuthState>(() => {
    const sessionService = inject(SessionService);
    const email = sessionService.isTokenValid()
      ? sessionService.getEmailFromToken()
      : null;
    return {
      user: email ? { email } : null,
      isLoading: false,
    };
  }),
  withComputed((store) => ({
    isAuthenticated: computed(() => store.user() !== null),
  })),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      sessionService = inject(SessionService)
    ) => ({
      login(credentials: LoginCredentials): Observable<boolean> {
        patchState(store, { isLoading: true });

        return authService.login(credentials).pipe(
          tap((response) => {
            sessionService.saveToken(
              response.accessToken,
              response.expiresIn
            );
          }),
          switchMap(() => authService.getMe()),
          tap((user) => patchState(store, { user, isLoading: false })),
          map(() => true),
          catchError(() => {
            sessionService.clearToken();
            patchState(store, { user: null, isLoading: false });
            return of(false);
          })
        );
      },

      logout(): void {
        sessionService.clearToken();
        patchState(store, { user: null });
      },
    })
  )
);
