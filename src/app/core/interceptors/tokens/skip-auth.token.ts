import { HttpContextToken } from '@angular/common/http';

/**
 * Request-level flag that tells the auth interceptor to NOT attach the
 * Bearer token. Used by endpoints that must not carry an Authorization
 * header — primarily the login endpoint itself, where the client is
 * exchanging credentials for a token and has nothing to send yet.
 *
 * Opt a single request out of authentication:
 *
 *   this.http.post<AuthTokenResponse>(
 *     url,
 *     body,
 *     { context: new HttpContext().set(SKIP_AUTH, true) }
 *   );
 */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
