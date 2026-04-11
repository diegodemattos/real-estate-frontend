/**
 * Base URL for every HTTP call in the app.
 * The mock interceptor only intercepts requests whose URL starts with this
 * prefix, so non-API requests (assets, fonts, third-party SDKs) pass through
 * untouched. Swap this for a real origin once a backend is available.
 */
export const API_BASE_URL = '/api';
