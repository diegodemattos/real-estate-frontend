import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from './auth.service';
import { AuthUser, LoginCredentials } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly sessionService = inject(SessionService);
  private readonly authService = inject(AuthService);

  /**
   * Hydrated synchronously from the token on construction so a page refresh
   * restores the user without waiting on an HTTP round-trip.
   */
  private readonly _user = signal<AuthUser | null>(this.resolveUserFromStorage());
  private readonly _isLoading = signal(false);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  /**
   * Full login flow:
   *   POST /auth/login → persist the token → GET /auth/me → update the user.
   * Emits true on success, false on failure.
   */
  login(credentials: LoginCredentials): Observable<boolean> {
    this._isLoading.set(true);

    return this.authService.login(credentials).pipe(
      tap((response) => {
        this.sessionService.saveToken(response.accessToken, response.expiresAt);
      }),
      switchMap(() => this.authService.getMe()),
      tap((user) => {
        this._user.set(user);
        this._isLoading.set(false);
      }),
      map(() => true),
      catchError(() => {
        this._isLoading.set(false);
        this.sessionService.clearToken();
        this._user.set(null);
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
    const email = this.sessionService.getEmailFromToken();
    return email ? { email } : null;
  }
}
