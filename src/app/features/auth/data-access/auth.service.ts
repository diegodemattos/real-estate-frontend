import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { SKIP_AUTH } from '../../../core/http/tokens/skip-auth.token';
import {
  AuthTokenResponse,
  AuthUser,
  LoginCredentials,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(credentials: LoginCredentials): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(
      `${API_BASE_URL}/auth/login`,
      { username: credentials.email, password: credentials.password },
      { context: new HttpContext().set(SKIP_AUTH, true) }
    );
  }

  getMe(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${API_BASE_URL}/auth/me`);
  }

  requestPasswordRecovery(email: string): Observable<void> {
    return this.http.post<void>(
      `${API_BASE_URL}/auth/forgot-password`,
      { email },
      { context: new HttpContext().set(SKIP_AUTH, true) }
    );
  }
}
