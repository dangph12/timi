import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getSkus } from '@/services/skus';
import { skusAtom } from '@/store/sku';

export function useSkus() {
  const setSkus = useSetAtom(skusAtom);
  const query = useQuery({
    queryKey: ['skus'],
    queryFn: getSkus,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) setSkus(query.data);
  }, [query.data, setSkus]);

  return query;
}
