export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
}

/** Shape returned by the `POST /auth/login` endpoint. */
export interface AuthTokenResponse {
  accessToken: string;
  /** Seconds until the token expires, as returned by the backend. */
  expiresIn: number;
}
