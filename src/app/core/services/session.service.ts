import { Injectable } from '@angular/core';

const AUTH_KEY: string = 're_auth';

interface StoredSession {
  email: string;
  accessToken: string;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  saveSession(email: string, accessToken: string, expiresIn: number): void {
    const expiresAt: number = Date.now() + expiresIn * 1000;
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ email, accessToken, expiresAt } satisfies StoredSession)
    );
  }

  getToken(): string | null {
    return this.read()?.accessToken ?? null;
  }

  getEmail(): string | null {
    return this.read()?.email ?? null;
  }

  isTokenValid(): boolean {
    const session: StoredSession | null = this.read();
    return session !== null && Date.now() < session.expiresAt;
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_KEY);
  }

  private read(): StoredSession | null {
    const raw: string | null = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredSession;
    } catch {
      return null;
    }
  }
}
