import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, delay, of, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

/**
 * Mock backend implemented as an HTTP interceptor.
 *
 * It short-circuits every request targeting `API_BASE_URL/...` and responds
 * with data sourced from localStorage, simulating a REST API that matches
 * the Swagger contract. Requests outside the API prefix pass through.
 *
 * Drop a real backend in: remove `mockInterceptor` from `app.config.ts`
 * (nothing else changes — the services already call HttpClient).
 */

// ---------- Mock backend state & constants ----------

const DEALS_KEY = 're_deals';
const MOCK_USERNAME = 'admin@termsheet.com';
const MOCK_PASSWORD = 'Ts@123456';
const MOCK_USER_ID = 'u-1';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const SIMULATED_LATENCY_MS = 600;

interface StoredDeal {
  id: string;
  dealName: string;
  purchasePrice: number;
  address: string;
  noi: number;
  capRate: number;
}

interface LoginBody {
  username: string;
  password: string;
}

interface CreateDealBody {
  dealName: string;
  purchasePrice: number;
  address: string;
  noi: number;
}

type UpdateDealBody = Partial<CreateDealBody>;

const SEED_DEALS: StoredDeal[] = [
  {
    id: '1',
    dealName: 'Sunset Apartments',
    purchasePrice: 2_500_000,
    address: '1234 Sunset Blvd, Los Angeles, CA',
    noi: 175_000,
    capRate: 175_000 / 2_500_000,
  },
  {
    id: '2',
    dealName: 'Downtown Office Tower',
    purchasePrice: 8_000_000,
    address: '500 Main St, New York, NY',
    noi: 640_000,
    capRate: 640_000 / 8_000_000,
  },
  {
    id: '3',
    dealName: 'Harbor Retail Center',
    purchasePrice: 3_200_000,
    address: '88 Harbor Dr, Miami, FL',
    noi: 256_000,
    capRate: 256_000 / 3_200_000,
  },
  {
    id: '4',
    dealName: 'Greenway Industrial Park',
    purchasePrice: 5_500_000,
    address: '200 Greenway Rd, Houston, TX',
    noi: 385_000,
    capRate: 385_000 / 5_500_000,
  },
  {
    id: '5',
    dealName: 'Lakeside Condos',
    purchasePrice: 1_800_000,
    address: '45 Lake Shore Dr, Chicago, IL',
    noi: 108_000,
    capRate: 108_000 / 1_800_000,
  },
  {
    id: '6',
    dealName: 'Midtown Plaza',
    purchasePrice: 4_200_000,
    address: '300 Peachtree St NE, Atlanta, GA',
    noi: 336_000,
    capRate: 336_000 / 4_200_000,
  },
  {
    id: '7',
    dealName: 'Riverfront Warehouse',
    purchasePrice: 6_800_000,
    address: '1 Pier Ave, Seattle, WA',
    noi: 476_000,
    capRate: 476_000 / 6_800_000,
  },
  {
    id: '8',
    dealName: 'Oak Park Medical Center',
    purchasePrice: 9_500_000,
    address: '200 Longwood Ave, Boston, MA',
    noi: 760_000,
    capRate: 760_000 / 9_500_000,
  },
  {
    id: '9',
    dealName: 'Desert Vista Townhomes',
    purchasePrice: 2_100_000,
    address: '750 E Camelback Rd, Phoenix, AZ',
    noi: 147_000,
    capRate: 147_000 / 2_100_000,
  },
  {
    id: '10',
    dealName: 'University Heights Flats',
    purchasePrice: 3_700_000,
    address: '400 W 6th St, Austin, TX',
    noi: 296_000,
    capRate: 296_000 / 3_700_000,
  },
];

// ---------- Interceptor entry point ----------

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  const path = req.url.slice(API_BASE_URL.length);
  const method = req.method;

  // POST /auth/login
  if (method === 'POST' && path === '/auth/login') {
    return handleLogin(req);
  }

  // POST /auth/forgot-password
  if (method === 'POST' && path === '/auth/forgot-password') {
    return handleForgotPassword(req);
  }

  // GET /auth/me
  if (method === 'GET' && path === '/auth/me') {
    return requireAuth(req, () => handleGetMe(req));
  }

  // GET /deals
  if (method === 'GET' && path === '/deals') {
    return requireAuth(req, () => handleGetDeals());
  }

  // POST /deals
  if (method === 'POST' && path === '/deals') {
    return requireAuth(req, () => handleCreateDeal(req));
  }

  // /deals/:id
  const dealIdMatch = /^\/deals\/([^/]+)$/.exec(path);
  if (dealIdMatch) {
    const id = decodeURIComponent(dealIdMatch[1]);
    if (method === 'GET') {
      return requireAuth(req, () => handleGetDeal(id));
    }
    if (method === 'PATCH') {
      return requireAuth(req, () => handleUpdateDeal(id, req));
    }
    if (method === 'DELETE') {
      return requireAuth(req, () => handleDeleteDeal(id));
    }
  }

  return mockError(404, `Mock endpoint not found: ${method} ${path}`);
};

// ---------- Endpoint handlers ----------

function handleLogin(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
  const body = (req.body as LoginBody | null) ?? null;
  if (
    !body ||
    body.username !== MOCK_USERNAME ||
    body.password !== MOCK_PASSWORD
  ) {
    return mockError(401, 'Invalid credentials');
  }
  const expiresAtMs = Date.now() + TOKEN_TTL_MS;
  const accessToken = buildMockToken(body.username, expiresAtMs);
  const expiresIn = Math.floor(TOKEN_TTL_MS / 1000);
  return mockSuccess({ accessToken, expiresIn }, 200);
}

/**
 * POST /auth/forgot-password — public endpoint (no Bearer token required).
 * Always resolves with 200 regardless of the email so the mock doesn't
 * disclose which addresses are registered, matching real backends.
 */
function handleForgotPassword(
  req: HttpRequest<unknown>
): Observable<HttpEvent<unknown>> {
  const body = req.body as { email?: unknown } | null;
  if (!body || typeof body.email !== 'string' || body.email.trim() === '') {
    return mockError(400, 'Email is required');
  }
  return of(new HttpResponse<null>({ status: 200, body: null })).pipe(
    delay(SIMULATED_LATENCY_MS)
  );
}

function handleGetMe(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
  const token = extractBearerToken(req);
  const payload = token ? decodeJwtPayload(token) : null;
  const email =
    payload && typeof payload['username'] === 'string'
      ? (payload['username'] as string)
      : MOCK_USERNAME;
  return mockSuccess({ id: MOCK_USER_ID, email }, 200);
}

function handleGetDeals(): Observable<HttpEvent<unknown>> {
  return mockSuccess(readDeals(), 200);
}

function handleGetDeal(id: string): Observable<HttpEvent<unknown>> {
  const deal = readDeals().find((d) => d.id === id);
  if (!deal) {
    return mockError(404, `Deal ${id} not found`);
  }
  return mockSuccess(deal, 200);
}

function handleCreateDeal(
  req: HttpRequest<unknown>
): Observable<HttpEvent<unknown>> {
  const body = req.body as CreateDealBody | null;
  if (!body) {
    return mockError(400, 'Request body is required');
  }
  const deal: StoredDeal = {
    id: Date.now().toString(),
    dealName: body.dealName,
    purchasePrice: body.purchasePrice,
    address: body.address,
    noi: body.noi,
    capRate: computeCapRate(body.noi, body.purchasePrice),
  };
  writeDeals([...readDeals(), deal]);
  return mockSuccess(deal, 201);
}

function handleUpdateDeal(
  id: string,
  req: HttpRequest<unknown>
): Observable<HttpEvent<unknown>> {
  const deals = readDeals();
  const existing = deals.find((d) => d.id === id);
  if (!existing) {
    return mockError(404, `Deal ${id} not found`);
  }
  const body = (req.body as UpdateDealBody | null) ?? {};
  const merged: StoredDeal = {
    ...existing,
    ...body,
  };
  merged.capRate = computeCapRate(merged.noi, merged.purchasePrice);
  writeDeals(deals.map((d) => (d.id === id ? merged : d)));
  return mockSuccess(merged, 200);
}

function handleDeleteDeal(id: string): Observable<HttpEvent<unknown>> {
  const deals = readDeals();
  if (!deals.some((d) => d.id === id)) {
    return mockError(404, `Deal ${id} not found`);
  }
  writeDeals(deals.filter((d) => d.id !== id));
  return of(new HttpResponse<null>({ status: 204, body: null })).pipe(
    delay(SIMULATED_LATENCY_MS)
  );
}

// ---------- Auth guard for protected handlers ----------

function requireAuth(
  req: HttpRequest<unknown>,
  handler: () => Observable<HttpEvent<unknown>>
): Observable<HttpEvent<unknown>> {
  const token = extractBearerToken(req);
  if (!token) {
    return mockError(401, 'Missing Bearer token');
  }
  const payload = decodeJwtPayload(token);
  if (
    !payload ||
    typeof payload['exp'] !== 'number' ||
    (payload['exp'] as number) * 1000 < Date.now()
  ) {
    return mockError(401, 'Token expired or invalid');
  }
  return handler();
}

// ---------- Response helpers ----------

function mockSuccess<T>(body: T, status: number): Observable<HttpEvent<T>> {
  return of(new HttpResponse<T>({ status, body })).pipe(
    delay(SIMULATED_LATENCY_MS)
  );
}

function mockError(
  status: number,
  message: string
): Observable<HttpEvent<unknown>> {
  const error = new HttpErrorResponse({
    status,
    statusText: message,
    error: { message },
  });
  // Delay the error emission with an of()+switchMap pair — the plain delay
  // operator only shifts next notifications, not errors.
  return of(null).pipe(
    delay(SIMULATED_LATENCY_MS),
    switchMap(() => throwError(() => error))
  );
}

// ---------- Local persistence ----------

function readDeals(): StoredDeal[] {
  const raw = localStorage.getItem(DEALS_KEY);

  if (raw === null) {
    writeDeals(SEED_DEALS);
    return SEED_DEALS;
  }

  try {
    return JSON.parse(raw) as StoredDeal[];
  } catch {
    writeDeals(SEED_DEALS);
    return SEED_DEALS;
  }
}

function writeDeals(deals: StoredDeal[]): void {
  localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
}

// ---------- JWT utilities ----------

function buildMockToken(email: string, expiresAtMs: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: MOCK_USER_ID,
      username: email,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiresAtMs / 1000),
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractBearerToken(req: HttpRequest<unknown>): string | null {
  const header = req.headers.get('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice('Bearer '.length);
}

function computeCapRate(noi: number, purchasePrice: number): number {
  return purchasePrice > 0 ? noi / purchasePrice : 0;
}
