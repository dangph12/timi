import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getOrders } from '@/services/orders';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { Button } from '@/components/ui/button';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { STATUS, STATUS_COLORS, formatCurrency, formatDate } from '@/constants/order';

export default function OrderListPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState(null);

  const { items, totalPages, isLoading, page, setPage } = usePaginatedQuery(
    ['orders', { filterStatus }],
    ({ page, size }) => {
      const params = { page, size };
      if (filterStatus) params.status = filterStatus;
      return getOrders(params);
    },
  );

  const handleStatusChange = (newStatus) => {
    setFilterStatus(newStatus);
    setPage(0);
  };

  const title = 'Đơn hàng của tôi - Tỉ Mỉ';

  const tabs = [null, ...Object.keys(STATUS)];

  return (
    <>
      <title>{title}</title>
      <div className="mx-auto w-full max-w-2xl px-4">
        <h1 className="text-4xl font-black font-heading tracking-tight border-b-2 border-primary/20 pb-4 mb-6">Đơn hàng của tôi</h1>

        <div className="relative mb-6 min-w-0">
          <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide -mx-4 px-4">
            {tabs.map((key) => {
              const isActive = filterStatus === key;
              const label = key ? STATUS[key] : 'Tất cả';
              return (
                <button
                  key={key ?? 'all'}
                  onClick={() => handleStatusChange(key)}
                  className={`shrink-0 text-sm pb-3 mr-6 last:mr-4 font-semibold transition-colors border-b-2 ${
                    isActive
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground hover:text-foreground border-transparent'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-background to-transparent" />
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-xl font-semibold text-muted-foreground">
              {filterStatus ? 'Không có đơn hàng nào với trạng thái này' : 'Chưa có đơn hàng nào'}
            </p>
            {!filterStatus && (
              <Button size="lg" onClick={() => navigate('/thiet-ke')}>Tạo đơn hàng ngay</Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((order) => (
              <button
                key={order.publicId}
                onClick={() => navigate(`/don-hang/${order.publicId}`)}
                className="w-full rounded-xl border border-border bg-background p-4 text-left cursor-pointer transition-colors hover:bg-muted/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-semibold">{order.publicId}</span>
                  <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.currentStatus] || 'bg-primary/10 text-primary'}`}>
                    {STATUS[order.currentStatus] || order.currentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                  <span className="text-lg font-black tabular-nums">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {order.itemCount} sản phẩm
                </div>
              </button>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Trang trước
            </Button>
            <span className="text-sm">
              <span className="font-bold text-foreground">Trang {page + 1}</span>
              <span className="text-muted-foreground"> / {totalPages}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Trang sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
