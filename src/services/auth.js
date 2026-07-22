import { api } from '@/lib/api';

const BASE = 'auth';

export const login = (email, password) =>
  api.post(`${BASE}/login`, { json: { email, password } }).json();

export const register = (body) =>
  api.post(`${BASE}/register`, { json: body }).json();

export const logout = () =>
  api.post(`${BASE}/logout`).json();

export const getMe = () =>
  api.get(`${BASE}/me`).json();

export const updateProfile = (data) =>
  api.put(`${BASE}/me`, { json: data }).json();

export const GOOGLE_OAUTH_URL = `${
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
}/oauth2/authorization/google`;
