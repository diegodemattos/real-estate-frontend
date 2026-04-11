import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginCredentials } from '../../models/auth.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  readonly errorMessage = input<string>('');
  readonly isLoading = input<boolean>(false);
  readonly login = output<LoginCredentials>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  /**
   * Drives the show/hide password toggle. Stays inside the component
   * because it is purely presentational state.
   */
  private readonly _isPasswordVisible = signal(false);
  readonly isPasswordVisible = this._isPasswordVisible.asReadonly();
  readonly passwordInputType = computed(() =>
    this._isPasswordVisible() ? 'text' : 'password'
  );

  togglePasswordVisibility(): void {
    this._isPasswordVisible.update((visible) => !visible);
  }

  isFieldInvalid(field: 'email' | 'password'): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  submit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.login.emit({
      email: value.email,
      password: value.password,
    });
  }
}
