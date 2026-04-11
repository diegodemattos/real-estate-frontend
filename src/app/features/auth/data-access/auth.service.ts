import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { SKIP_AUTH } from '../../../core/interceptors/tokens/skip-auth.token';
import {
  AuthTokenResponse,
  AuthUser,
  LoginCredentials,
} from '../models/auth.model';

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
   * POST /auth/forgot-password — public endpoint (no Bearer token).
   * The backend replies the same way regardless of whether the email is
   * registered, so the UI can surface a generic "if this email is
   * registered..." message without leaking account existence.
   */
  requestPasswordRecovery(email: string): Observable<void> {
    return this.http.post<void>(
      `${API_BASE_URL}/auth/forgot-password`,
      { email },
      { context: new HttpContext().set(SKIP_AUTH, true) }
    );
  }
}
