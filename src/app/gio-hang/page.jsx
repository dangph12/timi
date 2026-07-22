import { useNavigate, Link } from 'react-router';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import {
  useCartQuery,
  useUpdateCartItemQuantity,
  useRemoveCartItem,
} from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api';
import Pagination from '@/components/Pagination';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, page, setPage, totalElements, totalPages, isLoading, error } =
    useCartQuery();
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
          toast.error(await getErrorMessage(err));
        },
      }
    );
  };

  const handleRemove = (itemId) => {
    removeItem.mutate(itemId, {
      onError: async (err) => {
        toast.error(await getErrorMessage(err));
      },
    });
  };

  const title = 'Giỏ hàng - Tỉ Mỉ';

  return (
    <>
      <title>{title}</title>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-8 w-8" />
          <h1 className="text-4xl font-black font-heading tracking-tight">Giỏ hàng</h1>
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
            <div className="divide-y divide-border">
              {items.map((item) => {
                const unitPrice = item.priceAtPurchase ?? item.sku?.price ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 sm:py-5"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <img
                        src={item.characterDesign?.imageUrl}
                        alt={item.characterDesign?.name}
                        className="h-20 w-14 sm:h-24 sm:w-16 object-contain bg-foreground shrink-0 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-base truncate">
                          {item.characterDesign?.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.sku?.category?.name}
                          {item.sku?.category?.name && item.sku?.size?.name ? ' · ' : ''}
                          {item.sku?.size?.name}
                        </p>
                        <p className="text-lg font-black tabular-nums mt-1">
                          {unitPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={removeItem.isPending}
                        className="p-3 sm:p-2 text-muted-foreground hover:text-destructive transition-colors sm:hidden"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:gap-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateQty.isPending}
                          className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center bg-background hover:bg-muted transition-colors disabled:opacity-40"
                        >
                          <Minus className="size-3.5 stroke-2" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                          disabled={updateQty.isPending}
                          className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center bg-background hover:bg-muted transition-colors disabled:opacity-40"
                        >
                          <Plus className="size-3.5 stroke-2" />
                        </button>
                      </div>
                      <p className="text-lg font-black tabular-nums">
                        {(unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={removeItem.isPending}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors hidden sm:block"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              prevLabel="Trước"
              nextLabel="Sau"
              showIcons={false}
            />

            <div className="mt-8 border-t-2 border-border pt-6">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black font-heading">Tổng cộng</span>
                <span className="text-2xl font-black text-primary tabular-nums">
                  {subtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <Button
                onClick={() =>
                  navigate('/tao-don-hang', { state: { fromCart: true } })
                }
                className="mt-5 h-12 w-full rounded-full bg-btn-muted text-white text-base font-bold hover:bg-btn-muted/80"
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
