import { Injectable } from '@angular/core';
import { Observable, delay, map, of, throwError } from 'rxjs';
import { AuthTokenResponse, LoginCredentials } from '../models/auth.model';

const MOCK_EMAIL = 'admin@termsheet.com';
const MOCK_PASSWORD = 'Ts@123456';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const SIMULATED_LATENCY_MS = 600;

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Simulates a POST /api/auth/login call.
   * Uses RxJS operators to replicate async network behaviour without a real backend.
   * Replace the body with a real HttpClient.post() call when a backend is available.
   */
  login(credentials: LoginCredentials): Observable<AuthTokenResponse> {
    if (
      credentials.email !== MOCK_EMAIL ||
      credentials.password !== MOCK_PASSWORD
    ) {
      return throwError(() => new Error('Invalid credentials')).pipe(
        delay(SIMULATED_LATENCY_MS)
      );
    }

    const expiresAt = Date.now() + TOKEN_TTL_MS;

    return of(credentials).pipe(
      delay(SIMULATED_LATENCY_MS),
      map(() => ({
        accessToken: this.buildMockToken(credentials.email, expiresAt),
        expiresAt,
      }))
    );
  }

  /**
   * Simulates a POST /api/auth/password-recovery call.
   *
   * Always resolves successfully regardless of the email provided — the
   * real API would respond the same way to avoid disclosing which addresses
   * are registered. The UI surfaces a generic "if the email is registered..."
   * message to match that security posture.
   */
  requestPasswordRecovery(_email: string): Observable<void> {
    return of(void 0).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /**
   * Builds a mock JWT-shaped token (header.payload.signature).
   * The payload is a valid base64-encoded JSON so SessionService can decode the email.
   */
  private buildMockToken(email: string, expiresAt: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(expiresAt / 1000),
      })
    );
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }
}
