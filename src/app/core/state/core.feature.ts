import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AuthUser } from '../../features/auth/models/auth.model';
import { CoreActions } from './core.actions';

export interface CoreState {
  user: AuthUser | null;
}

const initialState: CoreState = {
  user: null,
};

export const coreFeature = createFeature({
  name: 'core',
  reducer: createReducer(
    initialState,
    on(CoreActions.hydrateUser, (state, { user }) => ({ ...state, user })),
    on(CoreActions.setUser, (state, { user }) => ({ ...state, user })),
    on(CoreActions.logout, (state) => ({ ...state, user: null })),
  ),
  extraSelectors: ({ selectUser }) => ({
    selectIsAuthenticated: createSelector(selectUser, (user) => user !== null),
  }),
});
