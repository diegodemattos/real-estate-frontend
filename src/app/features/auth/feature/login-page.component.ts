import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../data-access/auth.store';
import { LoginFormComponent } from '../ui/login-form.component';
import { LoginCredentials } from '../models/auth.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-card__header">
          <h1 class="login-card__title">Real Estate Portal</h1>
          <p class="login-card__subtitle">Sign in to manage your deals</p>
        </div>
        <app-login-form
          [errorMessage]="errorMessage()"
          (login)="onLogin($event)"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background-color: var(--color-bg);
      }

      .login-card {
        width: 100%;
        max-width: 420px;
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        padding: 2.5rem;
      }

      .login-card__header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .login-card__title {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--color-primary);
        margin-bottom: 0.375rem;
      }

      .login-card__subtitle {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }
    `,
  ],
})
export class LoginPageComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly errorMessage = signal('');

  onLogin(credentials: LoginCredentials): void {
    const success = this.authStore.login(credentials);
    if (success) {
      this.router.navigate(['/deals']);
    } else {
      this.errorMessage.set('Invalid username or password. Please try again.');
    }
  }
}
