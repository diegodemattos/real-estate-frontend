import { TestBed } from '@angular/core/testing';
import { PasswordRecoveryFormComponent } from './password-recovery-form.component';

describe('PasswordRecoveryFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasswordRecoveryFormComponent],
    });
  });

  function create() {
    const fixture = TestBed.createComponent(PasswordRecoveryFormComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('emits recover with the email when submitted with a valid email', () => {
    const fixture = create();
    fixture.componentInstance.form.patchValue({ email: 'user@example.com' });
    const spy = jest.fn();
    fixture.componentInstance.recover.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).toHaveBeenCalledWith('user@example.com');
  });

  it('does not emit when email is empty', () => {
    const fixture = create();
    const spy = jest.fn();
    fixture.componentInstance.recover.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not emit when email format is invalid', () => {
    const fixture = create();
    fixture.componentInstance.form.patchValue({ email: 'not-an-email' });
    const spy = jest.fn();
    fixture.componentInstance.recover.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not emit while isLoading is true', () => {
    const fixture = create();
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentInstance.form.patchValue({ email: 'user@example.com' });
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.recover.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });
});
