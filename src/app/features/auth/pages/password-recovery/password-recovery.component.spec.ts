import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Signal, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { PasswordRecoveryPageComponent } from './password-recovery.component';
import { AuthFacade } from '../../data-access/auth.facade';

describe('PasswordRecoveryPageComponent', () => {
  const requestRecoverySuccess$ = new Subject<object>();
  const requestRecoveryFailure$ = new Subject<{ error: string }>();

  let facade: {
    isMutating: jest.Mock;
    requestRecovery: jest.Mock;
    requestRecoverySuccess$: typeof requestRecoverySuccess$;
    requestRecoveryFailure$: typeof requestRecoveryFailure$;
  };

  beforeEach(() => {
    facade = {
      isMutating: jest.fn().mockReturnValue(signal(false) as Signal<boolean>),
      requestRecovery: jest.fn(),
      requestRecoverySuccess$,
      requestRecoveryFailure$,
    };

    TestBed.configureTestingModule({
      imports: [PasswordRecoveryPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: facade },
      ],
    });
  });

  it('sets isSuccess when requestRecoverySuccess$ emits', () => {
    const fixture = TestBed.createComponent(PasswordRecoveryPageComponent);
    fixture.detectChanges();

    requestRecoverySuccess$.next({});

    expect(fixture.componentInstance.isSuccess()).toBe(true);
    expect(fixture.componentInstance.isLoading()).toBe(false);
  });

  it('sets an error message when requestRecoveryFailure$ emits', () => {
    const fixture = TestBed.createComponent(PasswordRecoveryPageComponent);
    fixture.detectChanges();

    requestRecoveryFailure$.next({ error: 'network error' });

    expect(fixture.componentInstance.isSuccess()).toBe(false);
    expect(fixture.componentInstance.errorMessage()).toContain('Something went wrong');
  });

  it('onRecover clears state and dispatches via facade', () => {
    const fixture = TestBed.createComponent(PasswordRecoveryPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.isSuccess.set(true);
    fixture.componentInstance.errorMessage.set('old error');

    fixture.componentInstance.onRecover('a@b.c');

    expect(fixture.componentInstance.isSuccess()).toBe(false);
    expect(fixture.componentInstance.errorMessage()).toBe('');
    expect(facade.requestRecovery).toHaveBeenCalledWith('a@b.c');
  });
});
