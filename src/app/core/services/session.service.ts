import { Injectable } from '@angular/core';

const AUTH_KEY = 're_auth';

interface StoredAuth {
  accessToken: string;
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  saveToken(accessToken: string, expiresIn: number): void {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ accessToken, expiresIn } satisfies StoredAuth)
    );
  }

  getToken(): string | null {
    return this.read()?.accessToken ?? null;
  }

  getExpiresIn(): number | null {
    return this.read()?.expiresIn ?? null;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const exp = this.decodePayload(token)?.['exp'];
    return typeof exp === 'number' && Date.now() < exp * 1000;
  }

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const username = this.decodePayload(token)?.['username'];
    return typeof username === 'string' ? username : null;
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

  private decodePayload(token: string): Record<string, unknown> | null {
    try {
      return JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
