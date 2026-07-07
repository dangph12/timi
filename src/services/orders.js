import { api } from '@/lib/api';

export const createOrder = (data) => api.post('v1/orders', { json: data }).json();
