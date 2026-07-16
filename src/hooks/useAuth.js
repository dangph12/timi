import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { authApi } from '@/services/auth';
import { accessTokenAtom, userAtom, isAuthenticatedAtom } from '@/store/auth';
import { toast } from 'sonner';

export function useAuth() {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setAccessToken(data.accessToken);
      setUser({
        accountId: data.accountId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        phone: data.phone || null,
      });
      toast.success(data.message || 'Đăng nhập thành công');
      return data;
    } catch (error) {
      const { getErrorMessage } = await import('@/lib/api');
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
      setAccessToken(data.accessToken);
      setUser({
        accountId: data.accountId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        phone: body.phone || null,
      });
      toast.success(data.message || 'Đăng ký thành công');
      return data;
    } catch (error) {
      const { getErrorMessage } = await import('@/lib/api');
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
