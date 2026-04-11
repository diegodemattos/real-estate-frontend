import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginCredentials } from '../models/auth.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="login-form">
      <div class="field">
        <label class="field__label" for="username">Username</label>
        <input
          id="username"
          class="field__input"
          [class.field__input--error]="isFieldInvalid('username')"
          type="text"
          formControlName="username"
          autocomplete="username"
          placeholder="Enter your username"
        />
        @if (isFieldInvalid('username')) {
          <span class="field__error" role="alert">Username is required.</span>
        }
      </div>

      <div class="field">
        <label class="field__label" for="password">Password</label>
        <input
          id="password"
          class="field__input"
          [class.field__input--error]="isFieldInvalid('password')"
          type="password"
          formControlName="password"
          autocomplete="current-password"
          placeholder="Enter your password"
        />
        @if (isFieldInvalid('password')) {
          <span class="field__error" role="alert">Password is required.</span>
        }
      </div>

      @if (errorMessage()) {
        <div class="login-form__error" role="alert">
          {{ errorMessage() }}
        </div>
      }

      <button class="btn btn--primary btn--full" type="submit">
        Sign In
      </button>
    </form>
  `,
  styles: [
    `
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .field__label {
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-text);
      }

      .field__input {
        padding: 0.625rem 0.875rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-base);
        color: var(--color-text);
        background-color: var(--color-surface);
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
        width: 100%;

        &:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgb(91 63 214 / 0.15);
        }

        &::placeholder {
          color: var(--color-text-secondary);
        }
      }

      .field__input--error {
        border-color: var(--color-error);

        &:focus {
          box-shadow: 0 0 0 3px rgb(239 68 68 / 0.15);
        }
      }

      .field__error {
        font-size: var(--font-size-xs);
        color: var(--color-error);
      }

      .login-form__error {
        padding: 0.75rem 1rem;
        background-color: rgb(239 68 68 / 0.08);
        border: 1px solid rgb(239 68 68 / 0.25);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        color: var(--color-error);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        font-size: var(--font-size-base);
        font-weight: 500;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        transition: background-color 0.15s ease;
        font-family: inherit;
      }

      .btn--primary {
        background-color: var(--color-primary);
        color: var(--color-surface);

        &:hover {
          background-color: var(--color-primary-hover);
        }

        &:focus-visible {
          outline: 2px solid var(--color-secondary);
          outline-offset: 2px;
        }
      }

      .btn--full {
        width: 100%;
      }
    `,
  ],
})
export class LoginFormComponent {
  readonly errorMessage = input<string>('');
  readonly login = output<LoginCredentials>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isFieldInvalid(field: 'username' | 'password'): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.login.emit({
      username: value.username,
      password: value.password,
    });
  }
}
