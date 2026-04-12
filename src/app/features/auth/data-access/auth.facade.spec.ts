import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import { AuthFacade } from './auth.facade';
import { AuthActions } from './auth.actions';
import { authFeature } from './auth.feature';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let store: MockStore;
  const actions$ = new Subject<Action>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [authFeature.name]: { operation: { type: null, status: 'idle' } },
          },
        }),
        provideMockActions(() => actions$),
      ],
    });

    facade = TestBed.inject(AuthFacade);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('login dispatches AuthActions.login', () => {
    const credentials = { email: 'a@b.c', password: 'pw' };
    facade.login(credentials);
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login({ credentials }));
  });

  it('requestRecovery dispatches AuthActions.requestRecovery', () => {
    facade.requestRecovery('a@b.c');
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.requestRecovery({ email: 'a@b.c' }));
  });

  it('isMutating returns a signal reflecting operation status', () => {
    store.setState({
      [authFeature.name]: { operation: { type: 'login', status: 'loading' } },
    });
    expect(facade.isMutating('login')()).toBe(true);
    expect(facade.isMutating('requestRecovery')()).toBe(false);
  });
});
