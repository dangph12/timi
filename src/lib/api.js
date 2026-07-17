import ky from 'ky';
import { getDefaultStore } from 'jotai';
import { accessTokenAtom, userAtom } from '@/store/auth';

const jotaiStore = getDefaultStore();

let isRefreshing = false;
let refreshPromise = null;
let pendingRequests = [];
let hasRefreshFailed = false;

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
}

async function refreshAccessToken() {
  if (hasRefreshFailed) {
    throw new Error('Authentication refresh is unavailable');
  }

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    isRefreshing = true;

    try {
      const refreshRes = await ky.post(`${getApiBaseUrl()}/auth/refresh`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const { data } = await refreshRes.json();
      const newToken = data?.accessToken;

      if (!newToken) {
        throw new Error('Refresh response did not include an access token');
      }

      hasRefreshFailed = false;
      jotaiStore.set(accessTokenAtom, newToken);
      return newToken;
    } catch (error) {
      hasRefreshFailed = true;
      jotaiStore.set(accessTokenAtom, null);
      jotaiStore.set(userAtom, null);
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const api = ky.create({
  prefix: getApiBaseUrl(),
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  parseJson: text => {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    const { status, message, data } = parsed;
    if (data != null) {
      if (Array.isArray(data)) {
        data.status = status;
        data.message = message;
        return data;
      }
      return { ...data, status, message };
    }
    return parsed;
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = jotaiStore.get(accessTokenAtom);
        const isRefreshRequest = request.url.includes('/auth/refresh');

        if (token && !isRefreshRequest) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async ({ request, options, response }) => {
        if (!response || response.status !== 401) return;
        if (request.url.includes('/auth/refresh')) return;

        if (request.headers.get('X-Auth-Retried') === '1') {
          return;
        }

        if (hasRefreshFailed) {
          throw new Error('Authentication refresh is unavailable');
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingRequests.push({
              request: request.clone(),
              options,
              resolve,
              reject
            });
          });
        }

        try {
          const newToken = await refreshAccessToken();

          const queue = pendingRequests;
          pendingRequests = [];
          queue.forEach(({ request: req, resolve, reject }) => {
            try {
              const retryReq = req.clone();
              retryReq.headers.set('Authorization', `Bearer ${newToken}`);
              retryReq.headers.set('X-Auth-Retried', '1');
              resolve(ky(retryReq));
            } catch (error) {
              reject(error);
            }
          });

          const retryReq = request.clone();
          retryReq.headers.set('Authorization', `Bearer ${newToken}`);
          retryReq.headers.set('X-Auth-Retried', '1');
          return ky(retryReq);
        } catch (error) {
          const queue = pendingRequests;
          pendingRequests = [];
          queue.forEach(({ reject }) => reject(error));
          throw error;
        }
      }
    ]
  }
});

export function refreshToken() {
  return ky
    .post(`${getApiBaseUrl()}/auth/refresh`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
    .json()
    .then(res => res.data);
}

export async function getErrorMessage(error) {
  if (error?.data) {
    return error.data.message || 'Đã xảy ra lỗi';
  }
  if (error?.response) {
    try {
      const body = await error.response.clone().json();
      return body.message || 'Đã xảy ra lỗi';
    } catch (parseError) {
      void parseError;
    }
  }
  return error?.message || 'Đã xảy ra lỗi';
}
