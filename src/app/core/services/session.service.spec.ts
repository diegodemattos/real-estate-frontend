import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    localStorage.clear();
    service = new SessionService();
  });

  it('should persist email, token and compute expiresAt', () => {
    service.saveSession('admin@termsheet.com', 'abc.def.ghi', 3600);

    expect(service.getToken()).toBe('abc.def.ghi');
    expect(service.getEmail()).toBe('admin@termsheet.com');
  });

  it('should report a valid session when expiresAt is in the future', () => {
    service.saveSession('admin@termsheet.com', 'some.token', 3600);

    expect(service.isTokenValid()).toBe(true);
  });

  it('should report an invalid session when expiresAt is in the past', () => {
    service.saveSession('a@b.c', 'some.token', -1);

    expect(service.isTokenValid()).toBe(false);
  });

  it('should return null for every getter after clearToken', () => {
    service.saveSession('admin@termsheet.com', 'some.token', 1800);
    service.clearToken();

    expect(service.getToken()).toBeNull();
    expect(service.getEmail()).toBeNull();
    expect(service.isTokenValid()).toBe(false);
  });
});
