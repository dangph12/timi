import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import {
  cartItemsAtom,
  cartPageAtom,
  cartTotalElementsAtom,
  cartTotalPagesAtom,
} from '@/store/cart';
import { isAuthenticatedAtom } from '@/store/auth';
import {
  getCart,
  addCartItem,
  updateCartItemQuantity as updateQty,
  removeCartItem,
  checkoutCart,
} from '@/services/cart';
import { usePaginatedQuery } from './usePaginatedQuery';

export function useCart() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [page, setPage] = useAtom(cartPageAtom);
  const [, setItems] = useAtom(cartItemsAtom);
  const [, setTotalElements] = useAtom(cartTotalElementsAtom);
  const [, setTotalPages] = useAtom(cartTotalPagesAtom);

  const paginated = usePaginatedQuery(['cart'], ({ page }) => getCart({ page }), {
    page,
    setPage,
    staleTime: 30_000,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    setItems(paginated.items);
    setTotalElements(paginated.totalElements);
    setTotalPages(paginated.totalPages);
  }, [paginated.items, paginated.totalElements, paginated.totalPages, setItems, setTotalElements, setTotalPages]);

  return paginated;
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
