import { useNavigate, Link } from 'react-router';
import { useAtom } from 'jotai';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import {
  cartItemsAtom,
  cartPageAtom,
  cartTotalElementsAtom,
  cartTotalPagesAtom,
} from '@/store/cart';
import {
  useCart,
  useUpdateCartItemQuantity,
  useRemoveCartItem,
} from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { isLoading, error } = useCart();
  const [items] = useAtom(cartItemsAtom);
  const [page, setPage] = useAtom(cartPageAtom);
  const [totalElements] = useAtom(cartTotalElementsAtom);
  const [totalPages] = useAtom(cartTotalPagesAtom);
  const updateQty = useUpdateCartItemQuantity();
  const removeItem = useRemoveCartItem();

  const subtotal = items.reduce(
    (sum, item) => sum + (item.priceAtPurchase ?? item.sku?.price ?? 0) * item.quantity,
    0
  );

  const handleQtyChange = (itemId, newQty) => {
    if (newQty < 1) return;
    updateQty.mutate(
      { itemId, quantity: newQty },
      {
        onError: async (err) => {
          const { getErrorMessage } = await import('@/lib/api');
          toast.error(await getErrorMessage(err));
        },
      }
    );
  };

  const handleRemove = (itemId) => {
    removeItem.mutate(itemId, {
      onError: async (err) => {
        const { getErrorMessage } = await import('@/lib/api');
        toast.error(await getErrorMessage(err));
      },
    });
  };

  const title = 'Giỏ hàng - Tỉ Mỉ';

  return (
    <>
      <title>{title}</title>
      <div className="max-w-4xl mx-auto px-4 py-8 font-body">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-7 w-7" />
          <h1 className="text-3xl font-black">Giỏ hàng</h1>
          {!isLoading && (
            <span className="text-sm text-muted-foreground font-semibold">
              ({totalElements} sản phẩm)
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive text-sm">
            Không thể tải giỏ hàng. Vui lòng thử lại sau.
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-muted-foreground text-lg font-semibold">
              Giỏ hàng trống
            </p>
            <Button asChild>
              <Link to="/thiet-ke">Thiết kế ngay</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => {
                const unitPrice = item.priceAtPurchase ?? item.sku?.price ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                  >
                    <img
                      src={item.characterDesign?.imageUrl}
                      alt={item.characterDesign?.name}
                      className="h-20 w-14 object-contain bg-foreground shrink-0 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        {item.characterDesign?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.sku?.category?.name}
                        {item.sku?.category?.name && item.sku?.size?.name ? ' · ' : ''}
                        {item.sku?.size?.name}
                      </p>
                      <p className="text-sm font-bold mt-1">
                        {unitPrice.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateQty.isPending}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center disabled:opacity-40"
                      >
                        <Minus className="size-3 stroke-2" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                        disabled={updateQty.isPending}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center disabled:opacity-40"
                      >
                        <Plus className="size-3 stroke-2" />
                      </button>
                    </div>
                    <p className="text-sm font-bold w-24 text-right">
                      {(unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={removeItem.isPending}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Trước
                </Button>
                <span className="flex items-center text-sm text-muted-foreground px-3">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  Sau
                </Button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <p className="text-xl font-black">
                Tổng cộng:{' '}
                <span className="text-primary">
                  {subtotal.toLocaleString('vi-VN')}đ
                </span>
              </p>
              <Button
                onClick={() =>
                  navigate('/tao-don-hang', { state: { fromCart: true } })
                }
                className="h-12 px-8 rounded-full bg-btn-muted text-white text-base font-bold hover:bg-btn-muted/80"
              >
                THANH TOÁN
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
