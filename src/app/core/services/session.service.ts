import { Injectable } from '@angular/core';

const AUTH_KEY = 're_auth';

interface StoredAuth {
  accessToken: string;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  saveToken(accessToken: string, expiresAt: number): void {
    const entry: StoredAuth = { accessToken, expiresAt };
    localStorage.setItem(AUTH_KEY, JSON.stringify(entry));
  }

  getToken(): string | null {
    return this.read()?.accessToken ?? null;
  }

  getExpiry(): number | null {
    return this.read()?.expiresAt ?? null;
  }

  /**
   * Returns true only when a token exists AND has not yet expired.
   * Guards call this directly so expiry is always evaluated at navigation time.
   */
  isTokenValid(): boolean {
    const entry = this.read();
    if (!entry) return false;
    return Date.now() < entry.expiresAt;
  }

  /**
   * Decodes the payload segment of the mock JWT and returns the subject claim.
   * Returns null if the token is absent or malformed.
   */
  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.sub === 'string' ? payload.sub : null;
    } catch {
      return null;
    }
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
}
