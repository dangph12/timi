import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom } from '@/store/auth';
import {
  getCart,
  addCartItem,
  updateCartItemQuantity as updateQty,
  removeCartItem,
  checkoutCart,
} from '@/services/cart';
import { usePaginatedQuery } from './usePaginatedQuery';

export function useCartQuery({ enabled = true } = {}) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  return usePaginatedQuery(['cart'], ({ page }) => getCart({ page }), {
    staleTime: 30_000,
    enabled: isAuthenticated && enabled,
  });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateQty(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCartCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkoutCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}