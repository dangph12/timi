import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
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

export function useCart() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [page] = useAtom(cartPageAtom);
  const [, setItems] = useAtom(cartItemsAtom);
  const [, setTotalElements] = useAtom(cartTotalElementsAtom);
  const [, setTotalPages] = useAtom(cartTotalPagesAtom);

  const query = useQuery({
    queryKey: ['cart', page],
    queryFn: () => getCart(page),
    staleTime: 30_000,
    enabled: isAuthenticated,
  });

  if (query.data) {
    setItems(query.data.content || []);
    setTotalElements(query.data.totalElements ?? 0);
    setTotalPages(query.data.totalPages ?? 0);
  }

  return query;
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
