import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { authApi } from '@/services/auth';
import { accessTokenAtom, userAtom } from '@/store/auth';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUser = useSetAtom(userAtom);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('accessToken');
    if (!token) {
      setError('Không tìm thấy token xác thực');
      return;
    }

    setAccessToken(token);

    authApi
      .getMe()
      .then((data) => {
        setUser({
          accountId: data.accountId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          phone: data.phone || null,
        });
        navigate('/', { replace: true });
      })
      .catch(() => {
        setAccessToken(null);
        setError('Xác thực thất bại');
      });
  }, [searchParams, navigate, setAccessToken, setUser]);

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
