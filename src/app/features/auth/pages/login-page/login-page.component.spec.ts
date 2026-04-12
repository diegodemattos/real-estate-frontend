import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Signal, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthFacade } from '../../data-access/auth.facade';
import { AuthUser } from '../../models/auth.model';

describe('LoginPageComponent', () => {
  const loginSuccess$ = new Subject<{ user: AuthUser }>();
  const loginFailure$ = new Subject<{ error: string }>();

  let facade: {
    isMutating: jest.Mock;
    login: jest.Mock;
    loginSuccess$: typeof loginSuccess$;
    loginFailure$: typeof loginFailure$;
  };
  let router: Router;

  beforeEach(() => {
    facade = {
      isMutating: jest.fn().mockReturnValue(signal(false) as Signal<boolean>),
      login: jest.fn(),
      loginSuccess$,
      loginFailure$,
    };

    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: facade },
      ],
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('navigates to /main/deals-intake when loginSuccess$ emits', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();

    loginSuccess$.next({ user: { email: 'a@b.c' } });

    expect(router.navigate).toHaveBeenCalledWith(['/main/deals-intake']);
    expect(fixture.componentInstance.errorMessage()).toBe('');
  });

  it('sets an error message when loginFailure$ emits', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();

    loginFailure$.next({ error: 'Invalid credentials' });

    expect(router.navigate).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorMessage()).toContain(
      'Invalid email or password'
    );
  });

  it('onLogin clears the error and dispatches via facade', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.errorMessage.set('previous error');

    fixture.componentInstance.onLogin({ email: 'a@b.c', password: 'pw' });

    expect(fixture.componentInstance.errorMessage()).toBe('');
    expect(facade.login).toHaveBeenCalledWith({ email: 'a@b.c', password: 'pw' });
  });
});
