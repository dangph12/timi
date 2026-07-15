import { api } from '@/lib/api';

export const createOrder = (data) => api.post('v1/orders', { json: data }).json();

export const confirmCodPayment = (publicId) =>
  api.post(`v1/orders/${publicId}/confirm-payment`).json();

export const cancelOrder = (publicId) =>
  api.post(`v1/orders/${publicId}/cancel`).json();

export const getOrder = async (publicId) => {
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
