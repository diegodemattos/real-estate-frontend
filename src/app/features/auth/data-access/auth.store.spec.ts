import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthStore } from './auth.store';
import { AuthService } from './auth.service';
import { SessionService } from '../../../core/services/session.service';

describe('AuthStore', () => {
  let authService: { login: jest.Mock; getMe: jest.Mock };
  let sessionService: {
    isTokenValid: jest.Mock;
    getEmailFromToken: jest.Mock;
    saveToken: jest.Mock;
    clearToken: jest.Mock;
  };

  function configureAndInject(
    tokenValid = false,
    emailFromToken: string | null = null
  ) {
    sessionService.isTokenValid.mockReturnValue(tokenValid);
    sessionService.getEmailFromToken.mockReturnValue(emailFromToken);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SessionService, useValue: sessionService },
      ],
    });
    return TestBed.inject(AuthStore);
  }

  beforeEach(() => {
    authService = { login: jest.fn(), getMe: jest.fn() };
    sessionService = {
      isTokenValid: jest.fn(),
      getEmailFromToken: jest.fn(),
      saveToken: jest.fn(),
      clearToken: jest.fn(),
    };
  });

  it('starts with user = null when no valid token is persisted', () => {
    const store = configureAndInject(false);
    expect(store.user()).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('hydrates user from the persisted token on construction', () => {
    const store = configureAndInject(true, 'admin@termsheet.com');
    expect(store.user()).toEqual({ email: 'admin@termsheet.com' });
    expect(store.isAuthenticated()).toBe(true);
  });

  it('login() saves the token and populates user on success', (done) => {
    authService.login.mockReturnValue(
      of({ accessToken: 't', expiresIn: 3600 })
    );
    authService.getMe.mockReturnValue(of({ email: 'a@b.c' }));
    const store = configureAndInject(false);

    store.login({ email: 'a@b.c', password: 'pw' }).subscribe((success) => {
      expect(success).toBe(true);
      expect(sessionService.saveToken).toHaveBeenCalledWith('t', 3600);
      expect(store.user()).toEqual({ email: 'a@b.c' });
      expect(store.isLoading()).toBe(false);
      done();
    });
  });

  it('login() clears the token and emits false on error', (done) => {
    authService.login.mockReturnValue(throwError(() => new Error('401')));
    const store = configureAndInject(false);

    store.login({ email: 'a@b.c', password: 'pw' }).subscribe((success) => {
      expect(success).toBe(false);
      expect(sessionService.clearToken).toHaveBeenCalled();
      expect(store.user()).toBeNull();
      expect(store.isLoading()).toBe(false);
      done();
    });
  });

  it('logout() clears the token and resets the user signal', () => {
    const store = configureAndInject(true, 'a@b.c');
    store.logout();
    expect(sessionService.clearToken).toHaveBeenCalled();
    expect(store.user()).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
  });
});
