import { api } from '@/lib/api';

export const createOrder = (data) => api.post('v1/orders', { json: data }).json();

export const confirmCodPayment = (publicId) =>
  api.post(`v1/orders/${publicId}/confirm-payment`).json();

export const cancelOrder = (publicId) =>
  api.post(`v1/orders/${publicId}/cancel`).json();

export const getOrder = (publicId) => api.get(`v1/orders/${publicId}`).json();
