import { api } from '@/lib/api';

export const getParts = () => api.get('v1/parts').json();

export const getPartOptions = (partId, styleId) => {
  const searchParams = styleId != null ? { styleId } : {};
  return api.get(`v1/parts/${partId}/options`, { searchParams }).json();
};
