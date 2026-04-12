import { Injectable, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthState, authFeature } from './auth.feature';
import { AuthUser, LoginCredentials } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  readonly loginSuccess$: Observable<{ user: AuthUser }> = this.actions$.pipe(ofType(AuthActions.loginSuccess));
  readonly loginFailure$: Observable<{ error: string }> = this.actions$.pipe(ofType(AuthActions.loginFailure));
  readonly requestRecoverySuccess$: Observable<object> = this.actions$.pipe(
    ofType(AuthActions.requestRecoverySuccess)
  );
  readonly requestRecoveryFailure$: Observable<{ error: string }> = this.actions$.pipe(
    ofType(AuthActions.requestRecoveryFailure)
  );

  isMutating(type?: Exclude<AuthState['operation']['type'], null>): Signal<boolean> {
    return this.store.selectSignal(authFeature.selectIsMutating(type));
  }

  login(credentials: LoginCredentials): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  requestRecovery(email: string): void {
    this.store.dispatch(AuthActions.requestRecovery({ email }));
  }
}
