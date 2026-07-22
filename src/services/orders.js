import { api } from '@/lib/api';

let createOrderKey = crypto.randomUUID();

export const createOrder = async (data) => {
  const result = await api
    .post('v1/orders', { json: data, headers: { 'Idempotency-Key': createOrderKey } })
    .json();
  createOrderKey = crypto.randomUUID();
  return result;
};

const codPaymentKeys = new Map();

export const confirmCodPayment = async (publicId) => {
  if (!codPaymentKeys.has(publicId)) {
    codPaymentKeys.set(publicId, crypto.randomUUID());
  }
  const result = await api
    .post(`v1/orders/${publicId}/confirm-payment`, {
      headers: { 'Idempotency-Key': codPaymentKeys.get(publicId) },
    })
    .json();
  return result;
};

export const getOrders = (params = {}) =>
  api.get('v1/orders', { searchParams: params }).json();

export const getOrder = (publicId) =>
  api.get(`v1/orders/${publicId}`).json();

export const cancelOrder = (publicId) =>
  api.post(`v1/orders/${publicId}/cancel`).json();

export const getOrderForPayment = async (publicId) => {
  const raw = await api.get(`v1/orders/${publicId}`).json();
  const item = raw.items?.[0];
  return {
    ...raw,
    customer: {
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      address: raw.address,
    },
    item: item
      ? {
          designName: item.characterDesign?.name,
          image: item.characterDesign?.imageUrl,
          category: item.sku?.category?.name,
          size: item.sku?.size?.name,
          price: item.priceAtPurchase ?? item.sku?.price,
          quantity: item.quantity,
        }
      : undefined,
    cart: {
      subtotal: raw.totalAmount,
      total: raw.totalAmount,
    },
  };
};
