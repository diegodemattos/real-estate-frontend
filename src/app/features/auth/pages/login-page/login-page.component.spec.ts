import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthStore } from '../../data-access/auth.store';

describe('LoginPageComponent', () => {
  let authStore: { login: jest.Mock; isLoading: jest.Mock };
  let router: Router;

  beforeEach(() => {
    authStore = {
      login: jest.fn(),
      isLoading: jest.fn().mockReturnValue(false),
    };

    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStore, useValue: authStore },
      ],
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('navigates to /main/deals on successful login', () => {
    authStore.login.mockReturnValue(of(true));
    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onLogin({
      email: 'a@b.c',
      password: 'pw',
    });

    expect(authStore.login).toHaveBeenCalledWith({
      email: 'a@b.c',
      password: 'pw',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/main/deals']);
    expect(fixture.componentInstance.errorMessage()).toBe('');
  });

  it('sets an error message on failed login', () => {
    authStore.login.mockReturnValue(of(false));
    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onLogin({
      email: 'a@b.c',
      password: 'wrong',
    });

    expect(router.navigate).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorMessage()).toContain(
      'Invalid email or password'
    );
  });
});
