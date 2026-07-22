const PROVINCE_PREFIXES = ['thành phố ', 'tỉnh '];
const WARD_PREFIXES = ['phường ', 'xã ', 'đặc khu '];

function stripPrefixes(name, prefixes) {
  let s = name.trim().toLowerCase();
  for (const p of prefixes) {
    if (s.startsWith(p)) return s.slice(p.length);
  }
  return s;
}

export function matchProvince(provinces, name) {
  if (!name || !provinces?.length) return null;
  const normalized = name.trim().toLowerCase();

  let match = provinces.find((p) => p.name.toLowerCase() === normalized);
  if (match) return match;

  const stripped = stripPrefixes(normalized, PROVINCE_PREFIXES);
  match = provinces.find((p) => {
    const apiStripped = stripPrefixes(p.name, PROVINCE_PREFIXES);
    return apiStripped === stripped;
  });
  if (match) return match;

  match = provinces.find((p) => {
    const apiStripped = stripPrefixes(p.name, PROVINCE_PREFIXES);
    return apiStripped.includes(stripped) || stripped.includes(apiStripped);
  });
  return match || null;
}

export function matchWard(wards, name) {
  if (!name || !wards?.length) return null;
  const normalized = name.trim().toLowerCase();

  let match = wards.find((w) => w.name.toLowerCase() === normalized);
  if (match) return match;

  const stripped = stripPrefixes(normalized, WARD_PREFIXES);
  match = wards.find((w) => {
    const apiStripped = stripPrefixes(w.name, WARD_PREFIXES);
    return apiStripped === stripped;
  });
  if (match) return match;

  match = wards.find((w) => {
    const apiStripped = stripPrefixes(w.name, WARD_PREFIXES);
    return apiStripped.includes(stripped) || stripped.includes(apiStripped);
  });
  return match || null;
}

export function parseAddress(fullAddress) {
  if (!fullAddress) return { street: '', wardName: '', provinceName: '' };
  const parts = fullAddress.split(', ');

  if (parts.length === 1) {
    return { street: parts[0], wardName: '', provinceName: '' };
  }

  if (parts.length === 2) {
    return { street: parts[0], wardName: '', provinceName: parts[1] };
  }

  return {
    street: parts.slice(0, -2).join(', '),
    wardName: parts.at(-2),
    provinceName: parts.at(-1),
  };
}

export function buildAddress(street, wardName, provinceName) {
  return [street, wardName, provinceName].filter(Boolean).join(', ');
}
