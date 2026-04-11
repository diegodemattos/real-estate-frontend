import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from './auth.service';
import { AuthUser, LoginCredentials } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly sessionService = inject(SessionService);
  private readonly authService = inject(AuthService);

  /**
   * Hydrated from localStorage on construction so that a page refresh
   * restores the authenticated user without requiring a new login.
   */
  private readonly _user = signal<AuthUser | null>(this.resolveUserFromStorage());
  private readonly _isLoading = signal(false);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  /**
   * Calls the (mock) login API, persists the token, and updates the user signal.
   * Returns an observable that emits true on success and false on failure.
   */
  login(credentials: LoginCredentials): Observable<boolean> {
    this._isLoading.set(true);

    return this.authService.login(credentials).pipe(
      tap((response) => {
        this.sessionService.saveToken(response.accessToken, response.expiresAt);
        this._user.set({ username: credentials.username });
        this._isLoading.set(false);
      }),
      map(() => true),
      catchError(() => {
        this._isLoading.set(false);
        return of(false);
      })
    );
  }

  logout(): void {
    this.sessionService.clearToken();
    this._user.set(null);
  }

  private resolveUserFromStorage(): AuthUser | null {
    if (!this.sessionService.isTokenValid()) return null;
    const username = this.sessionService.getUsernameFromToken();
    return username ? { username } : null;
  }
}
