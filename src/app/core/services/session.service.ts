import { Injectable } from '@angular/core';

const AUTH_KEY = 're_auth';

interface StoredAuth {
  accessToken: string;
  /** Seconds until expiration, as returned by the backend. Kept in storage
   *  to mirror the API response shape — the actual validity check reads
   *  the JWT `exp` claim so this field is informational. */
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  saveToken(accessToken: string, expiresIn: number): void {
    const entry: StoredAuth = { accessToken, expiresIn };
    localStorage.setItem(AUTH_KEY, JSON.stringify(entry));
  }

  getToken(): string | null {
    return this.read()?.accessToken ?? null;
  }

  getExpiresIn(): number | null {
    return this.read()?.expiresIn ?? null;
  }

  /**
   * Returns true only when a token exists AND its JWT `exp` claim is still
   * in the future. Reading the expiration from the token payload itself
   * (instead of tracking an `issuedAt` alongside `expiresIn` in storage)
   * keeps the stored shape faithful to the API response while giving an
   * accurate "is this session still valid" answer — guards call this
   * directly so expiry is always evaluated at navigation time.
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeTokenPayload(token);
    if (!payload || typeof payload['exp'] !== 'number') return false;
    return Date.now() < (payload['exp'] as number) * 1000;
  }

  /**
   * Reads the `username` claim from the JWT — the backend stores the
   * user's email there. Returns null if the token is absent or malformed.
   */
  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeTokenPayload(token);
    return typeof payload?.['username'] === 'string'
      ? (payload['username'] as string)
      : null;
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_KEY);
  }

  private read(): StoredAuth | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredAuth;
    } catch {
      return null;
    }
  }

  private decodeTokenPayload(
    token: string
  ): Record<string, unknown> | null {
    try {
      return JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
