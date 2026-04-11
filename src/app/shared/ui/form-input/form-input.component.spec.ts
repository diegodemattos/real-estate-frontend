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
        formControlName="field"
      />
    </form>
  `,
})
class HostComponent {
  label = 'Email';
  type: 'text' | 'email' | 'password' | 'number' = 'email';
  required = true;
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

  it('renders the label and required marker when required is true', () => {
    const fixture = createHost();
    const label = fixture.nativeElement.querySelector('.form-input__label');
    expect(label.textContent).toContain('Email');
    expect(fixture.nativeElement.querySelector('.form-input__required')).toBeTruthy();
  });

  it('writes typed values back to the FormControl (string for text types)', () => {
    const fixture = createHost();
    const el = input(fixture);
    el.value = 'user@example.com';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls['field'].value).toBe(
      'user@example.com'
    );
  });

  it('coerces numeric inputs to numbers and empty to null', () => {
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

  it('displays the required error message after blur on an empty control', () => {
    const fixture = createHost();
    const el = input(fixture);
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const err = fixture.nativeElement.querySelector('.form-input__error');
    expect(err.textContent).toContain('Email is required');
  });

  it('displays the email error when the value is an invalid email', () => {
    const fixture = createHost();
    const el = input(fixture);
    el.value = 'not-an-email';
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const err = fixture.nativeElement.querySelector('.form-input__error');
    expect(err.textContent).toContain('Please enter a valid email');
  });

  it('renders the password visibility toggle when type is password', () => {
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
