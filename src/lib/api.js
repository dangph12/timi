import ky, { isHTTPError } from 'ky';
import { getDefaultStore } from 'jotai';
import { accessTokenAtom, userAtom } from '@/store/auth';

const jotaiStore = getDefaultStore();

let refreshPromise = null;
let hasRefreshFailed = false;

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
}

export function resetAuthState() {
  hasRefreshFailed = false;
}

export function refreshAccessToken() {
  if (hasRefreshFailed) {
    return Promise.reject(new Error('Phiên đăng nhập đã hết hạn'));
  }

  refreshPromise ??= (async () => {
    try {
      const { data } = await ky
        .post(`${getApiBaseUrl()}/auth/refresh`, { credentials: 'include' })
        .json();

      if (!data?.accessToken) {
        throw new Error('Refresh response did not include an access token');
      }

      jotaiStore.set(accessTokenAtom, data.accessToken);
      return data;
    } catch (error) {
      if (isHTTPError(error)) {
        hasRefreshFailed = true;
        jotaiStore.set(accessTokenAtom, null);
        jotaiStore.set(userAtom, null);
      }
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const api = ky.create({
  prefix: getApiBaseUrl(),
  credentials: 'include',
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
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401 || retryCount > 0) return;
        if (hasRefreshFailed) return;

        const failedToken = request.headers
          .get('Authorization')
          ?.replace('Bearer ', '');
        const currentToken = jotaiStore.get(accessTokenAtom);

        let newToken;
        if (currentToken && currentToken !== failedToken) {
          newToken = currentToken;
        } else {
          try {
            const data = await refreshAccessToken();
            newToken = data.accessToken;
          } catch {
            return;
          }
        }

        const headers = new Headers(request.headers);
        headers.set('Authorization', `Bearer ${newToken}`);
        return ky.retry({
          request: new Request(request, { headers }),
          code: 'TOKEN_REFRESHED'
        });
      }
    ]
  }
});

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
