export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number;
}
