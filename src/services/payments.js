import { api } from '@/lib/api';

export const createTransaction = (data) => api.post('v1/transactions', { json: data }).json();
