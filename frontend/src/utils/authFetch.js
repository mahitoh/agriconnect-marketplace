import { API_ENDPOINTS } from '../config/api';

/**
 * Drop-in replacement for fetch() that auto-refreshes expired JWT tokens.
 *
 * Usage: import { authFetch } from '../utils/authFetch';
 *        const res = await authFetch('/api/something', { method: 'POST', ... });
 *
 * If the server responds with 401 "Token expired", this will:
 *   1. Call POST /api/auth/refresh with the expired token
 *   2. Store the new token in localStorage
 *   3. Retry the original request with the new token
 *   4. If refresh also fails → clear auth and redirect to /login
 */

let isRefreshing = false;
let refreshPromise = null;

const refreshToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');

  const res = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  const newToken = data.data?.token;
  if (!newToken) throw new Error('No token in refresh response');

  localStorage.setItem('token', newToken);
  return newToken;
};

const doRefresh = () => {
  // Deduplicate: if multiple requests hit 401 at the same time,
  // only one refresh call is made and the rest wait on the same promise
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken()
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const forceLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Only redirect if not already on login page
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login?expired=1';
  }
};

/**
 * authFetch — use this instead of raw fetch() for any authenticated API call.
 * Automatically injects the Bearer token and handles refresh on expiry.
 */
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  // Inject auth header
  const headers = {
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  // If 401 with "Token expired" → try refresh
  if (res.status === 401) {
    let body;
    try {
      body = await res.clone().json();
    } catch { body = {}; }

    if (body.message?.toLowerCase().includes('token expired')) {
      try {
        const newToken = await doRefresh();

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(url, { ...options, headers });
      } catch {
        forceLogout();
        throw new Error('Session expired. Please login again.');
      }
    } else if (body.message?.toLowerCase().includes('invalid token') ||
               body.message?.toLowerCase().includes('no token')) {
      forceLogout();
      throw new Error('Session invalid. Please login again.');
    }
  }

  return res;
};

export default authFetch;
