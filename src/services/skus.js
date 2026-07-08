import { api } from '@/lib/api';

export const getSkus = () => api.get('v1/skus').json();
