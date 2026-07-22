import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { parseAddress, matchProvince, matchWard } from '@/lib/address';

export function useAddressSelection(userAddress) {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const provincesQuery = useQuery({
    queryKey: ['provinces'],
    queryFn: () => ky('https://provinces.open-api.vn/api/v2/p/').json(),
    staleTime: Infinity,
  });

  const matchedProvince = useMemo(() => {
    if (!userAddress || !provincesQuery.data) return null;
    const { provinceName } = parseAddress(userAddress);
    if (!provinceName) return null;
    return matchProvince(provincesQuery.data, provinceName);
  }, [userAddress, provincesQuery.data]);

  const effectiveProvince = selectedProvince ?? matchedProvince;

  const wardsQuery = useQuery({
    queryKey: ['wards', effectiveProvince?.code],
    queryFn: () =>
      ky(`https://provinces.open-api.vn/api/v2/p/${effectiveProvince.code}?depth=2`).json(),
    enabled: !!effectiveProvince,
    staleTime: Infinity,
  });

  const matchedWard = useMemo(() => {
    if (!effectiveProvince || !wardsQuery.data?.wards) return null;
    const { wardName } = parseAddress(userAddress || '');
    if (!wardName) return null;
    return matchWard(wardsQuery.data.wards, wardName);
  }, [effectiveProvince, wardsQuery.data, userAddress]);

  const effectiveWard = selectedWard ?? matchedWard;

  return {
    selectedProvince,
    setSelectedProvince,
    selectedWard,
    setSelectedWard,
    effectiveProvince,
    effectiveWard,
    provincesQuery,
    wardsQuery,
  };
}
