import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { CoreEffects } from './core.effects';
import { CoreActions } from './core.actions';
import { SessionService } from '../services/session.service';

describe('CoreEffects', () => {
  let actions$: Subject<Action>;
  let effects: CoreEffects;
  let sessionService: {
    isTokenValid: jest.Mock;
    getEmail: jest.Mock;
    clearToken: jest.Mock;
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    sessionService = {
      isTokenValid: jest.fn().mockReturnValue(false),
      getEmail: jest.fn().mockReturnValue(null),
      clearToken: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CoreEffects,
        provideMockActions(() => actions$),
        { provide: SessionService, useValue: sessionService },
      ],
    });

    effects = TestBed.inject(CoreEffects);
  });

  describe('hydrate$', () => {
    it('should dispatch hydrateUser when a valid token is persisted', (done) => {
      sessionService.isTokenValid.mockReturnValue(true);
      sessionService.getEmail.mockReturnValue('admin@termsheet.com');

      effects.hydrate$.subscribe((action) => {
        expect(action).toEqual(
          CoreActions.hydrateUser({ user: { email: 'admin@termsheet.com' } })
        );
        done();
      });

      actions$.next({ type: ROOT_EFFECTS_INIT });
    });

    it('should dispatch nothing when no valid token is persisted', (done) => {
      sessionService.isTokenValid.mockReturnValue(false);
      let dispatched = false;

      effects.hydrate$.subscribe(() => { dispatched = true; });
      actions$.next({ type: ROOT_EFFECTS_INIT });

      setTimeout(() => {
        expect(dispatched).toBe(false);
        done();
      }, 0);
    });
  });

  describe('logout$', () => {
    it('should clear the session token', (done) => {
      effects.logout$.subscribe(() => {
        expect(sessionService.clearToken).toHaveBeenCalled();
        done();
      });

      actions$.next(CoreActions.logout());
    });
  });
});
