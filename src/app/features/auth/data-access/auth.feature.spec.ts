import { AuthActions } from './auth.actions';
import { AuthState, authFeature } from './auth.feature';

const { reducer } = authFeature;

describe('authFeature reducer', () => {
  const initialState: AuthState = {
    operation: { type: null, status: 'idle' },
  };

  it('should return the initial state', () => {
    const state = reducer(undefined, { type: '@ngrx/store/init' });
    expect(state).toEqual(initialState);
  });

  describe('login', () => {
    it('should set operation to login/loading', () => {
      const state = reducer(
        initialState,
        AuthActions.login({ credentials: { email: 'a@b.c', password: 'pw' } })
      );
      expect(state.operation).toEqual({ type: 'login', status: 'loading' });
    });

    it('should set operation to login/success on loginSuccess', () => {
      const loading = reducer(
        initialState,
        AuthActions.login({ credentials: { email: 'a@b.c', password: 'pw' } })
      );
      const state = reducer(loading, AuthActions.loginSuccess({ user: { email: 'a@b.c' } }));
      expect(state.operation).toEqual({ type: 'login', status: 'success' });
    });

    it('should set operation to login/error on loginFailure', () => {
      const loading = reducer(
        initialState,
        AuthActions.login({ credentials: { email: 'a@b.c', password: 'pw' } })
      );
      const state = reducer(loading, AuthActions.loginFailure({ error: 'fail' }));
      expect(state.operation).toEqual({ type: 'login', status: 'error' });
    });
  });

  describe('requestRecovery', () => {
    it('should set operation to requestRecovery/loading', () => {
      const state = reducer(initialState, AuthActions.requestRecovery({ email: 'a@b.c' }));
      expect(state.operation).toEqual({ type: 'requestRecovery', status: 'loading' });
    });

    it('should set operation to requestRecovery/success', () => {
      const loading = reducer(initialState, AuthActions.requestRecovery({ email: 'a@b.c' }));
      const state = reducer(loading, AuthActions.requestRecoverySuccess());
      expect(state.operation).toEqual({ type: 'requestRecovery', status: 'success' });
    });

    it('should set operation to requestRecovery/error', () => {
      const loading = reducer(initialState, AuthActions.requestRecovery({ email: 'a@b.c' }));
      const state = reducer(loading, AuthActions.requestRecoveryFailure({ error: 'fail' }));
      expect(state.operation).toEqual({ type: 'requestRecovery', status: 'error' });
    });
  });
});

describe('authFeature selectors', () => {
  it('should return true from selectIsMutating when matching type is loading', () => {
    const selector = authFeature.selectIsMutating('login');
    expect(selector.projector({ type: 'login', status: 'loading' })).toBe(true);
  });

  it('should return false from selectIsMutating when type does not match', () => {
    const selector = authFeature.selectIsMutating('login');
    expect(selector.projector({ type: 'requestRecovery', status: 'loading' })).toBe(false);
  });

  it('should return true from selectIsMutating without type when any operation is loading', () => {
    const selector = authFeature.selectIsMutating();
    expect(selector.projector({ type: 'requestRecovery', status: 'loading' })).toBe(true);
  });

  it('should return false from selectIsMutating without type when idle', () => {
    const selector = authFeature.selectIsMutating();
    expect(selector.projector({ type: null, status: 'idle' })).toBe(false);
  });
});
