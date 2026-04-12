import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FormInputComponent } from './form-input.component';

@Component({
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <app-form-input
        [label]="label"
        [type]="type"
        [required]="required"
        [errors]="errorMessages"
        formControlName="field"
      />
    </form>
  `,
})
class HostComponent {
  label = 'Email';
  type: 'text' | 'email' | 'password' | 'number' = 'email';
  required = true;
  errorMessages: Record<string, string> = {
    required: 'Email is required.',
    email: 'Please enter a valid email.',
  };
  form: UntypedFormGroup = new UntypedFormGroup({
    field: new UntypedFormControl('', [Validators.required, Validators.email]),
  });
}

describe('FormInputComponent', () => {
  function createHost() {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  function input(fixture: any): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('should render the label and required marker when required is true', () => {
    const fixture = createHost();
    const label = fixture.nativeElement.querySelector('.form-input__label');
    expect(label.textContent).toContain('Email');
    expect(fixture.nativeElement.querySelector('.form-input__required')).toBeTruthy();
  });

  it('should write typed values back to the FormControl (string for text types)', () => {
    const fixture = createHost();
    const el = input(fixture);
    el.value = 'user@example.com';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls['field'].value).toBe(
      'user@example.com'
    );
  });

  it('should coerce numeric inputs to numbers and empty to null', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.type = 'number';
    fixture.componentInstance.form = new UntypedFormGroup({
      field: new UntypedFormControl(null),
    });
    fixture.detectChanges();

    const el = input(fixture);
    el.value = '42';
    el.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.form.controls['field'].value).toBe(42);

    el.value = '';
    el.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.form.controls['field'].value).toBeNull();
  });

  it('should display the required error message after blur on an empty control', () => {
    const fixture = createHost();
    const el = input(fixture);
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const err = fixture.nativeElement.querySelector('.form-input__error');
    expect(err.textContent).toContain('Email is required');
  });

  it('should display the email error when the value is an invalid email', () => {
    const fixture = createHost();
    const el = input(fixture);
    el.value = 'not-an-email';
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const err = fixture.nativeElement.querySelector('.form-input__error');
    expect(err.textContent).toContain('Please enter a valid email');
  });

  it('should show no error text when errors input has no mapping for the active validator', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.errorMessages = {};
    fixture.detectChanges();

    const el = input(fixture);
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Red border still appears (shouldShowError), but no text is rendered
    expect(
      fixture.nativeElement.querySelector('.form-input__input--error')
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.form-input__error')).toBeNull();
  });

  it('should display the message from { error: "string" } custom validator error directly', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.errorMessages = {};
    const customValidator = () => ({ error: 'Custom validator message.' });
    fixture.componentInstance.form = new UntypedFormGroup({
      field: new UntypedFormControl('any-value', [customValidator]),
    });
    fixture.detectChanges();

    const el = input(fixture);
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const err = fixture.nativeElement.querySelector('.form-input__error');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Custom validator message.');
  });

  it('should render the password visibility toggle when type is password', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.type = 'password';
    fixture.componentInstance.form = new UntypedFormGroup({
      field: new UntypedFormControl(''),
    });
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.form-input__password-toggle')
    ).toBeTruthy();
  });
});
