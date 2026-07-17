import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { getOrders } from '@/services/orders';
import { Button } from '@/components/ui/button';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const statusLabels = {
  CREATED: 'Đã tạo',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const size = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => getOrders({ page, size }),
  });

  const orders = data?.data?.content ?? [];
  const totalPages = data?.data?.page?.totalPages ?? 0;

  const title = 'Đơn hàng của tôi - Tỉ Mỉ';

  return (
    <>
      <title>{title}</title>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-black mb-6">Đơn hàng của tôi</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
            <Package className="h-12 w-12" />
            <p>Chưa có đơn hàng nào</p>
            <Button onClick={() => navigate('/thiet-ke')}>Tạo đơn hàng</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.publicId}
                onClick={() => navigate(`/don-hang/${order.publicId}`)}
                className="w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{order.publicId}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {statusLabels[order.currentStatus] || order.currentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatDate(order.createdAt)}</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(order.totalAmount)}
                  </span>
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
            <span className="text-sm text-muted-foreground">
              Trang {page + 1} / {totalPages}
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
