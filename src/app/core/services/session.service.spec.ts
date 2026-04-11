import { SessionService } from './session.service';

function encodeBase64Url(value: Record<string, unknown>): string {
  return btoa(JSON.stringify(value));
}

function buildJwt(payload: Record<string, unknown>): string {
  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' });
  const body = encodeBase64Url(payload);
  const signature = btoa('test-signature');
  return `${header}.${body}.${signature}`;
}

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    localStorage.clear();
    service = new SessionService();
  });

  it('persists the access token and expiresIn and returns them back', () => {
    service.saveToken('abc.def.ghi', 3600);

    expect(service.getToken()).toBe('abc.def.ghi');
    expect(service.getExpiresIn()).toBe(3600);
  });

  it('reports a valid session when the JWT exp claim is in the future', () => {
    const futureExpSeconds = Math.floor(Date.now() / 1000) + 60 * 60;
    const token = buildJwt({
      sub: 'u-1',
      username: 'admin@termsheet.com',
      exp: futureExpSeconds,
    });

    service.saveToken(token, 3600);

    expect(service.isTokenValid()).toBe(true);
    expect(service.getEmailFromToken()).toBe('admin@termsheet.com');
  });

  it('reports an invalid session when the JWT exp claim is in the past', () => {
    const pastExpSeconds = Math.floor(Date.now() / 1000) - 60;
    const token = buildJwt({ username: 'a@b.c', exp: pastExpSeconds });

    service.saveToken(token, 3600);

    expect(service.isTokenValid()).toBe(false);
  });

  it('returns null for every getter after clearToken', () => {
    service.saveToken('some.jwt.here', 1800);
    service.clearToken();

    expect(service.getToken()).toBeNull();
    expect(service.getExpiresIn()).toBeNull();
    expect(service.isTokenValid()).toBe(false);
    expect(service.getEmailFromToken()).toBeNull();
  });
});
