import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import { CoreFacade } from './core.facade';
import { CoreActions } from './core.actions';
import { coreFeature } from './core.feature';

describe('CoreFacade', () => {
  let facade: CoreFacade;
  let store: MockStore;
  const actions$ = new Subject<Action>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { [coreFeature.name]: { user: null } } }),
        provideMockActions(() => actions$),
      ],
    });

    facade = TestBed.inject(CoreFacade);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should return null for user by default', () => {
    expect(facade.user()).toBeNull();
  });

  it('should return false for isAuthenticated when user is null', () => {
    expect(facade.isAuthenticated()).toBe(false);
  });

  it('should reflect store state for user', () => {
    store.setState({ [coreFeature.name]: { user: { email: 'a@b.c' } } });
    expect(facade.user()).toEqual({ email: 'a@b.c' });
    expect(facade.isAuthenticated()).toBe(true);
  });

  it('should dispatch CoreActions.logout on logout', () => {
    facade.logout();
    expect(store.dispatch).toHaveBeenCalledWith(CoreActions.logout());
  });
});
