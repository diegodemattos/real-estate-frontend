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

  it('user returns null by default', () => {
    expect(facade.user()).toBeNull();
  });

  it('isAuthenticated returns false when user is null', () => {
    expect(facade.isAuthenticated()).toBe(false);
  });

  it('user reflects store state', () => {
    store.setState({ [coreFeature.name]: { user: { email: 'a@b.c' } } });
    expect(facade.user()).toEqual({ email: 'a@b.c' });
    expect(facade.isAuthenticated()).toBe(true);
  });

  it('logout dispatches CoreActions.logout', () => {
    facade.logout();
    expect(store.dispatch).toHaveBeenCalledWith(CoreActions.logout());
  });
});
