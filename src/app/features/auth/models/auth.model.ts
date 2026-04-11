export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  username: string;
}

/** Shape returned by the (mock) login API endpoint. */
export interface AuthTokenResponse {
  accessToken: string;
  /** Unix timestamp in milliseconds when the token expires. */
  expiresAt: number;
}
