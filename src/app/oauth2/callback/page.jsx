import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { getMe } from '@/services/auth';
import { accessTokenAtom, userAtom } from '@/store/auth';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUser = useSetAtom(userAtom);
  const token = searchParams.get('accessToken');

  const [error, setError] = useState(
    token ? null : 'Không tìm thấy token xác thực'
  );

  useEffect(() => {
    if (!token) return;

    setAccessToken(token);

    getMe()
      .then((data) => {
        setUser({
          accountId: data.accountId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          phone: data.phone || null,
          address: data.address || null,
        });
        navigate('/', { replace: true });
      })
      .catch(() => {
        setAccessToken(null);
        setError('Xác thực thất bại');
      });
  }, [token, navigate, setAccessToken, setUser]);

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
