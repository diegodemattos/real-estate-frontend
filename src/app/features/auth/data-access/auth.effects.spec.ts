import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Subject, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthActions } from './auth.actions';
import { CoreActions } from '../../../core/state/core.actions';
import { AuthService } from './auth.service';
import { SessionService } from '../../../core/services/session.service';

describe('AuthEffects', () => {
  let actions$: Subject<Action>;
  let effects: AuthEffects;
  let authService: { login: jest.Mock; requestPasswordRecovery: jest.Mock };
  let sessionService: {
    saveSession: jest.Mock;
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    authService = { login: jest.fn(), requestPasswordRecovery: jest.fn() };
    sessionService = {
      saveSession: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authService },
        { provide: SessionService, useValue: sessionService },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('login$', () => {
    it('should save the session and dispatch loginSuccess on success', (done) => {
      authService.login.mockReturnValue(of({ accessToken: 'tok', expiresIn: 3600 }));

      effects.login$.subscribe((action) => {
        expect(sessionService.saveSession).toHaveBeenCalledWith('a@b.c', 'tok', 3600);
        expect(action).toEqual(AuthActions.loginSuccess({ user: { email: 'a@b.c' } }));
        done();
      });

      actions$.next(AuthActions.login({ credentials: { email: 'a@b.c', password: 'pw' } }));
    });

    it('should dispatch loginFailure on error', (done) => {
      authService.login.mockReturnValue(throwError(() => new Error('401')));

      effects.login$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginFailure.type);
        done();
      });

      actions$.next(AuthActions.login({ credentials: { email: 'a@b.c', password: 'wrong' } }));
    });
  });

  describe('setUserOnLogin$', () => {
    it('should dispatch CoreActions.setUser when loginSuccess fires', (done) => {
      effects.setUserOnLogin$.subscribe((action) => {
        expect(action).toEqual(CoreActions.setUser({ user: { email: 'a@b.c' } }));
        done();
      });

      actions$.next(AuthActions.loginSuccess({ user: { email: 'a@b.c' } }));
    });
  });

  describe('requestRecovery$', () => {
    it('should dispatch requestRecoverySuccess on success', (done) => {
      authService.requestPasswordRecovery.mockReturnValue(of(void 0));

      effects.requestRecovery$.subscribe((action) => {
        expect(action).toEqual(AuthActions.requestRecoverySuccess());
        done();
      });

      actions$.next(AuthActions.requestRecovery({ email: 'a@b.c' }));
    });

    it('should dispatch requestRecoveryFailure on error', (done) => {
      authService.requestPasswordRecovery.mockReturnValue(throwError(() => new Error('500')));

      effects.requestRecovery$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.requestRecoveryFailure.type);
        done();
      });

      actions$.next(AuthActions.requestRecovery({ email: 'a@b.c' }));
    });
  });
});
