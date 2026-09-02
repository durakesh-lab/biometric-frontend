import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Flag and queue to handle concurrent requests while token is refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach interceptor to default global axios instance used across all page components
axios.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('biometric_token');
      if (token) {
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Request Interceptor: Attach Access Token ──────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('biometric_token');
      if (token) {
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Shared 401 response handler for auto-refresh
const handle401Error = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
      localStorage.removeItem('biometric_token');
      localStorage.removeItem('biometric_refresh_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem('biometric_refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('biometric_token');
      localStorage.removeItem('biometric_refresh_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        { withCredentials: true }
      );

      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token;

      if (newAccessToken) {
        localStorage.setItem('biometric_token', newAccessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      if (newRefreshToken) {
        localStorage.setItem('biometric_refresh_token', newRefreshToken);
      }

      processQueue(null, newAccessToken);
      return axios(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      localStorage.removeItem('biometric_token');
      localStorage.removeItem('biometric_refresh_token');
      window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

// ── Response Interceptors: Silent Auto-Refresh on 401 Unauthorized ─
axios.interceptors.response.use((response) => response, handle401Error);
api.interceptors.response.use((response) => response, handle401Error);

export default api;
