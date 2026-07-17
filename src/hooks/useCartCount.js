import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom } from '@/store/auth';
import { getCartCount } from '@/services/cart';

export function useCartCount() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  return useQuery({
    queryKey: ['cart', 'count'],
    queryFn: getCartCount,
    staleTime: 30_000,
    enabled: isAuthenticated,
  });
}
