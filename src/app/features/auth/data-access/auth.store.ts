import { Injectable, computed, signal } from '@angular/core';
import { AuthUser, LoginCredentials } from '../models/auth.model';

const MOCK_USERNAME = 'admin';
const MOCK_PASSWORD = '123456';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<AuthUser | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(credentials: LoginCredentials): boolean {
    if (
      credentials.username === MOCK_USERNAME &&
      credentials.password === MOCK_PASSWORD
    ) {
      this._user.set({ username: credentials.username });
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
  }
}
