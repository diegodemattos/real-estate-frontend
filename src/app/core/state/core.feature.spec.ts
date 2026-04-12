import { CoreActions } from './core.actions';
import { CoreState, coreFeature } from './core.feature';

const { reducer } = coreFeature;

describe('coreFeature reducer', () => {
  const initialState: CoreState = { user: null };

  it('should return the initial state', () => {
    const state = reducer(undefined, { type: '@ngrx/store/init' });
    expect(state).toEqual(initialState);
  });

  it('should set the user on hydrateUser', () => {
    const state = reducer(initialState, CoreActions.hydrateUser({ user: { email: 'a@b.c' } }));
    expect(state.user).toEqual({ email: 'a@b.c' });
  });

  it('should set the user on setUser', () => {
    const state = reducer(initialState, CoreActions.setUser({ user: { email: 'x@y.z' } }));
    expect(state.user).toEqual({ email: 'x@y.z' });
  });

  it('should clear the user on logout', () => {
    const logged = reducer(initialState, CoreActions.setUser({ user: { email: 'a@b.c' } }));
    const state = reducer(logged, CoreActions.logout());
    expect(state.user).toBeNull();
  });
});

describe('coreFeature selectors', () => {
  it('should return true for selectIsAuthenticated when user exists', () => {
    const result = coreFeature.selectIsAuthenticated.projector({ email: 'a@b.c' });
    expect(result).toBe(true);
  });

  it('should return false for selectIsAuthenticated when user is null', () => {
    const result = coreFeature.selectIsAuthenticated.projector(null);
    expect(result).toBe(false);
  });
});
