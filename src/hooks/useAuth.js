import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from '@/services/auth';
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
    address: data.address || null,
  };
}

export function useAuth() {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      resetAuthState();
      setAccessToken(data.accessToken);
      setUser(normalizeUser(data));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(data.message || 'Đăng nhập thành công');
      return data;
    } catch (error) {
      const msg = await getErrorMessage(error);
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAccessToken, setUser, queryClient]);

  const register = useCallback(async (body) => {
    setLoading(true);
    try {
      const data = await registerApi(body);
      resetAuthState();
      setAccessToken(data.accessToken);
      setUser({ ...normalizeUser(data), phone: body.phone || null });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(data.message || 'Đăng ký thành công');
      return data;
    } catch (error) {
      const msg = await getErrorMessage(error);
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAccessToken, setUser, queryClient]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Silently ignore logout errors
    } finally {
      setAccessToken(null);
      setUser(null);
      queryClient.clear();
      toast.success('Đã đăng xuất');
    }
  }, [setAccessToken, setUser, queryClient]);

  return { user, isAuthenticated, loading, login, register, logout };
}
