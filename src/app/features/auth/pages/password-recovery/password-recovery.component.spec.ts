import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasswordRecoveryPageComponent } from './password-recovery.component';
import { AuthService } from '../../data-access/auth.service';

describe('PasswordRecoveryPageComponent', () => {
  let authService: { requestPasswordRecovery: jest.Mock };

  beforeEach(() => {
    authService = { requestPasswordRecovery: jest.fn() };
    TestBed.configureTestingModule({
      imports: [PasswordRecoveryPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  it('flips isSuccess on a successful request', () => {
    authService.requestPasswordRecovery.mockReturnValue(of(void 0));
    const fixture = TestBed.createComponent(PasswordRecoveryPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onRecover('a@b.c');
    expect(authService.requestPasswordRecovery).toHaveBeenCalledWith('a@b.c');
    expect(fixture.componentInstance.isSuccess()).toBe(true);
    expect(fixture.componentInstance.isLoading()).toBe(false);
  });

  it('sets an error message on a failed request', () => {
    authService.requestPasswordRecovery.mockReturnValue(
      throwError(() => new Error('network'))
    );
    const fixture = TestBed.createComponent(PasswordRecoveryPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onRecover('a@b.c');
    expect(fixture.componentInstance.isSuccess()).toBe(false);
    expect(fixture.componentInstance.errorMessage()).toContain(
      'Something went wrong'
    );
  });
});
