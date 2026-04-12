import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { RequestStatus } from '../../../shared/interfaces/request-status.interface';

export interface AuthState {
  operation: {
    type: 'login' | 'requestRecovery' | null;
    status: RequestStatus;
  };
}

const initialState: AuthState = {
  operation: { type: null, status: 'idle' },
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    on(AuthActions.login, (state) => ({
      ...state,
      operation: { type: 'login' as const, status: 'loading' as const },
    })),
    on(AuthActions.loginSuccess, (state) => ({
      ...state,
      operation: { type: 'login' as const, status: 'success' as const },
    })),
    on(AuthActions.loginFailure, (state) => ({
      ...state,
      operation: { type: 'login' as const, status: 'error' as const },
    })),

    on(AuthActions.requestRecovery, (state) => ({
      ...state,
      operation: { type: 'requestRecovery' as const, status: 'loading' as const },
    })),
    on(AuthActions.requestRecoverySuccess, (state) => ({
      ...state,
      operation: { type: 'requestRecovery' as const, status: 'success' as const },
    })),
    on(AuthActions.requestRecoveryFailure, (state) => ({
      ...state,
      operation: { type: 'requestRecovery' as const, status: 'error' as const },
    })),
  ),
  extraSelectors: ({ selectOperation }) => ({
    selectIsMutating: (type?: Exclude<AuthState['operation']['type'], null>) =>
      createSelector(selectOperation, (op) =>
        type !== undefined
          ? op.type === type && op.status === 'loading'
          : op.status === 'loading'
      ),
  }),
});
