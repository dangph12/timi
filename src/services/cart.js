import { api } from '@/lib/api';

export const getCart = (page = 0) =>
  api.get('v1/cart', { searchParams: { page } }).json();

export const addCartItem = (data) =>
  api.post('v1/cart/items', { json: data }).json();

export const updateCartItemQuantity = (itemId, quantity) =>
  api.put(`v1/cart/items/${itemId}`, { json: { quantity } }).json();

export const removeCartItem = (itemId) =>
  api.delete(`v1/cart/items/${itemId}`).json();

export const checkoutCart = (data) =>
  api.post('v1/cart/checkout', { json: data }).json();

export const getCartCount = () =>
  api.get('v1/cart/count').text().then(t => JSON.parse(t).data);
