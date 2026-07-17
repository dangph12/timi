import { api } from '@/lib/api';

const BASE = 'auth';

export const authApi = {
  login: (email, password) =>
    api.post(`${BASE}/login`, { json: { email, password } }).json(),

  register: (body) =>
    api.post(`${BASE}/register`, { json: body }).json(),

  refresh: () =>
    api.post(`${BASE}/refresh`).json(),

  logout: () =>
    api.post(`${BASE}/logout`).json(),

  getMe: () =>
    api.get(`${BASE}/me`).json(),

  updateProfile: (data) =>
    api.put(`${BASE}/me`, { json: data }).json(),
};

export const GOOGLE_OAUTH_URL = `${
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
}/oauth2/authorization/google`;
