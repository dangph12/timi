import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { refreshAccessToken } from '@/lib/api';
import { userAtom } from '@/store/auth';

export default function AuthInitializer({ children }) {
  const setUser = useSetAtom(userAtom);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    refreshAccessToken()
      .then((data) => {
        setUser({
          accountId: data.accountId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          phone: data.phone || null,
          address: data.address || null,
        });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [setUser]);

  if (!ready) return null;

  return children;
}
