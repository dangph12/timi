import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { refreshToken } from '@/lib/api';
import { accessTokenAtom, userAtom } from '@/store/auth';

export default function AuthInitializer({ children }) {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUser = useSetAtom(userAtom);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    refreshToken()
      .then((data) => {
        setAccessToken(data.accessToken);
        setUser({
          accountId: data.accountId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          phone: null,
        });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [setAccessToken, setUser]);

  if (!ready) return null;

  return children;
}
