import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from './auth.service';
import { AuthUser, LoginCredentials } from '../models/auth.model';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

/**
 * Session state for the authenticated user, implemented with @ngrx/signals.
 *
 * The state is hydrated synchronously from the persisted token via a
 * `withState` factory — by the time any component calls `inject(AuthStore)`
 * the user signal is already populated, so a page refresh doesn't flash
 * an unauthenticated UI.
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(() => {
    // `withState` accepts a factory that runs in an injection context,
    // so we can pull services in here to rebuild state from localStorage
    // at store creation time.
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
      /**
       * Full login flow:
       *   POST /auth/login → persist the token → GET /auth/me → update user.
       * Emits true on success, false on failure so the calling page can
       * decide whether to navigate or show an inline error.
       */
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
          tap((user) => {
            patchState(store, { user, isLoading: false });
          }),
          map(() => true),
          catchError(() => {
            // A failed login anywhere in the chain leaves the app logged
            // out — clear any stale token and reset the user.
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
