import { CoreActions } from './core.actions';
import { CoreState, coreFeature } from './core.feature';

const { reducer } = coreFeature;

describe('coreFeature reducer', () => {
  const initialState: CoreState = { user: null };

  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@ngrx/store/init' });
    expect(state).toEqual(initialState);
  });

  it('hydrateUser sets the user', () => {
    const state = reducer(initialState, CoreActions.hydrateUser({ user: { email: 'a@b.c' } }));
    expect(state.user).toEqual({ email: 'a@b.c' });
  });

  it('setUser sets the user', () => {
    const state = reducer(initialState, CoreActions.setUser({ user: { email: 'x@y.z' } }));
    expect(state.user).toEqual({ email: 'x@y.z' });
  });

  it('logout clears the user', () => {
    const logged = reducer(initialState, CoreActions.setUser({ user: { email: 'a@b.c' } }));
    const state = reducer(logged, CoreActions.logout());
    expect(state.user).toBeNull();
  });
});

describe('coreFeature selectors', () => {
  it('selectIsAuthenticated returns true when user exists', () => {
    const result = coreFeature.selectIsAuthenticated.projector({ email: 'a@b.c' });
    expect(result).toBe(true);
  });

  it('selectIsAuthenticated returns false when user is null', () => {
    const result = coreFeature.selectIsAuthenticated.projector(null);
    expect(result).toBe(false);
  });
});
