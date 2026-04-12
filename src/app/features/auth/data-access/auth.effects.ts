import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { CoreActions } from '../../../core/state/core.actions';
import { AuthService } from './auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          tap((response) =>
            this.sessionService.saveSession(credentials.email, response.accessToken, response.expiresIn)
          ),
          map(() => AuthActions.loginSuccess({ user: { email: credentials.email } })),
          catchError(() => of(AuthActions.loginFailure({ error: 'Invalid credentials' })))
        )
      )
    )
  );

  setUserOnLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(({ user }) => CoreActions.setUser({ user }))
    )
  );

  requestRecovery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestRecovery),
      switchMap(({ email }) =>
        this.authService.requestPasswordRecovery(email).pipe(
          map(() => AuthActions.requestRecoverySuccess()),
          catchError(() =>
            of(AuthActions.requestRecoveryFailure({ error: 'Recovery request failed' }))
          )
        )
      )
    )
  );
}
