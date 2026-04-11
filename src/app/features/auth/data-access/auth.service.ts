import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { SKIP_AUTH } from '../../../core/interceptors/tokens/skip-auth.token';
import {
  AuthTokenResponse,
  AuthUser,
  LoginCredentials,
} from '../models/auth.model';

const PASSWORD_RECOVERY_LATENCY_MS = 600;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /**
   * POST /auth/login — opted out of the auth interceptor via the SKIP_AUTH
   * context flag because this is the very endpoint that hands out tokens.
   *
   * The UI collects an email, but the Swagger contract names the field
   * `username`, so we map at the HTTP boundary.
   */
  login(credentials: LoginCredentials): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(
      `${API_BASE_URL}/auth/login`,
      {
        username: credentials.email,
        password: credentials.password,
      },
      {
        context: new HttpContext().set(SKIP_AUTH, true),
      }
    );
  }

  /**
   * GET /auth/me — returns the currently authenticated user.
   * Auth interceptor attaches the Bearer token automatically.
   */
  getMe(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${API_BASE_URL}/auth/me`);
  }

  /**
   * Simulated password-recovery request. Not part of the Swagger contract,
   * so it stays as a direct observable rather than a mocked HTTP call.
   * Always resolves successfully so the UI can't disclose whether an
   * address is registered.
   */
  requestPasswordRecovery(_email: string): Observable<void> {
    return of(void 0).pipe(delay(PASSWORD_RECOVERY_LATENCY_MS));
  }
}
