// Shared API/auth layer (Day 9).
// Configures the GLOBAL axios instance so EVERY existing `import axios from 'axios'`
// call is fixed at once — no need to edit 30 files:
//   1. Request interceptor → ensures Authorization is sent as `Bearer <token>`
//      (backend's JwtStrategy uses fromAuthHeaderAsBearerToken()).
//   2. Response interceptor → on 401, clear the token and redirect to /login.
// Also exports a preconfigured `api` instance (baseURL set) for new code to use.
import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

function normalizeAuthHeader(config) {
  // Prefer an explicitly-set header; otherwise attach the stored token.
  let token =
    (config.headers && (config.headers.Authorization || config.headers.authorization)) || null;
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('biometric_token');
  }
  if (token) {
    // Add the Bearer prefix if the caller passed a raw token.
    const value = String(token).startsWith('Bearer ') ? String(token) : `Bearer ${token}`;
    config.headers = config.headers || {};
    config.headers.Authorization = value;
  }
  return config;
}

function handle401(error) {
  if (
    typeof window !== 'undefined' &&
    error?.response?.status === 401 &&
    !window.location.pathname.includes('/login')
  ) {
    localStorage.removeItem('biometric_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
}

let installed = false;
export function installAxiosInterceptors() {
  if (installed) return;
  installed = true;
  // Patch the GLOBAL axios used everywhere in the app.
  axios.interceptors.request.use(normalizeAuthHeader);
  axios.interceptors.response.use((r) => r, handle401);
}

// Preconfigured instance for new code (baseURL + same interceptors).
export const api = axios.create({ baseURL: BASE });
api.interceptors.request.use(normalizeAuthHeader);
api.interceptors.response.use((r) => r, handle401);

export default api;
