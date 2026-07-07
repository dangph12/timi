import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { getParts, getPartOptions } from '@/services/parts';
import { designSelectionsAtom } from '@/store/design';

export function useParts() {
  return useQuery({
    queryKey: ['parts'],
    queryFn: getParts,
    staleTime: Infinity,
  });
}

export function usePartOptions(partId) {
  const selections = useAtomValue(designSelectionsAtom);
  const enabled = selections.styleId != null || partId === 1;

  return useQuery({
    queryKey: ['partOptions', partId, selections.styleId],
    queryFn: () => getPartOptions(partId, selections.styleId),
    enabled,
    staleTime: Infinity,
  });
}
