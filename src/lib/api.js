import ky from 'ky';
import { getDefaultStore } from 'jotai';
import { accessTokenAtom, userAtom } from '@/store/auth';

const jotaiStore = getDefaultStore();

let isRefreshing = false;

export const api = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  parseJson: (text) => {
    const { status, message, data } = JSON.parse(text);
    if (Array.isArray(data)) {
      data.status = status;
      data.message = message;
      return data;
    }
    return { ...data, status, message };
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = jotaiStore.get(accessTokenAtom);
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) return;
        if (request.url.includes('/auth/refresh')) return;
        if (isRefreshing) return;

        isRefreshing = true;
        try {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
          const refreshRes = await ky.post(`${baseUrl}/auth/refresh`);
          const { data } = await refreshRes.json();
          jotaiStore.set(accessTokenAtom, data.accessToken);
          request.headers.set('Authorization', `Bearer ${data.accessToken}`);
          return ky(request);
        } catch {
          jotaiStore.set(accessTokenAtom, null);
          jotaiStore.set(userAtom, null);
        } finally {
          isRefreshing = false;
        }
      },
    ],
  },
});

export async function getErrorMessage(error) {
  if (error?.response) {
    try {
      const body = await error.response.clone().json();
      return body.message || 'Đã xảy ra lỗi';
    } catch {}
  }
  return error?.message || 'Đã xảy ra lỗi';
}
