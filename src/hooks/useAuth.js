import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { authApi } from '@/services/auth';
import { accessTokenAtom, userAtom, isAuthenticatedAtom } from '@/store/auth';
import { getErrorMessage, resetAuthState } from '@/lib/api';
import { toast } from 'sonner';

function normalizeUser(data) {
  return {
    accountId: data.accountId,
    email: data.email,
    fullName: data.fullName,
    role: data.role,
    phone: data.phone || null,
  };
}

export function useAuth() {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      resetAuthState();
      setAccessToken(data.accessToken);
      setUser(normalizeUser(data));
      toast.success(data.message || 'Đăng nhập thành công');
      return data;
    } catch (error) {
      const msg = await getErrorMessage(error);
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAccessToken, setUser]);

  const register = useCallback(async (body) => {
    setLoading(true);
    try {
      const data = await authApi.register(body);
      resetAuthState();
      setAccessToken(data.accessToken);
      setUser({ ...normalizeUser(data), phone: body.phone || null });
      toast.success(data.message || 'Đăng ký thành công');
      return data;
    } catch (error) {
      const msg = await getErrorMessage(error);
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAccessToken, setUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Silently ignore logout errors
    } finally {
      setAccessToken(null);
      setUser(null);
      toast.success('Đã đăng xuất');
    }
  }, [setAccessToken, setUser]);

  return { user, isAuthenticated, loading, login, register, logout };
}
