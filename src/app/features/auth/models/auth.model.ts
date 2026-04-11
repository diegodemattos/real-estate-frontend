export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
}

/** Shape returned by the (mock) login API endpoint. */
export interface AuthTokenResponse {
  accessToken: string;
  /** Unix timestamp in milliseconds when the token expires. */
  expiresAt: number;
}
