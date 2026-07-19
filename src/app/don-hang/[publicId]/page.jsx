import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { getOrderDetail } from '@/services/orders';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package } from 'lucide-react';

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
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', publicId],
    queryFn: () => getOrderDetail(publicId),
  });

  const title = order
    ? `Đơn hàng ${publicId} - Tỉ Mỉ`
    : 'Đơn hàng - Tỉ Mỉ';

  return (
    <>
      <title>{title}</title>
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-4 -ml-2"
          onClick={() => navigate('/don-hang')}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        {isLoading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : !order ? (
          <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
        ) : (
          <div className="space-y-6">
            {/* Order header */}
            <div>
              <h1 className="text-2xl font-black">
                Đơn hàng {publicId}
              </h1>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {statusLabels[order.currentStatus] || order.currentStatus}
              </span>
            </div>

            <Separator />

            {/* Customer info */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Thông tin khách hàng</h2>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Tên:</span> {order.account?.fullName}</p>
                <p><span className="text-muted-foreground">Email:</span> {order.email}</p>
                <p><span className="text-muted-foreground">SĐT:</span> {order.account?.phone}</p>
                <p><span className="text-muted-foreground">Địa chỉ:</span> {order.address}</p>
                {order.note && (
                  <p><span className="text-muted-foreground">Ghi chú:</span> {order.note}</p>
                )}
              </div>
            </section>

            <Separator />

            {/* Order info */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Chi tiết đơn hàng</h2>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Phương thức thanh toán:</span>{' '}
                  {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                </p>
                <p>
                  <span className="text-muted-foreground">Trạng thái thanh toán:</span>{' '}
                  {order.currentPaymentStatus === 'PENDING' ? 'Chờ thanh toán' : order.currentPaymentStatus}
                </p>
                <p>
                  <span className="text-muted-foreground">Tổng tiền:</span>{' '}
                  <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                </p>
                <p><span className="text-muted-foreground">Ngày tạo:</span> {formatDate(order.createdAt)}</p>
                {order.expiresAt && (
                  <p><span className="text-muted-foreground">Hết hạn:</span> {formatDate(order.expiresAt)}</p>
                )}
              </div>
            </section>

            <Separator />

            {/* Items */}
            <section>
              <h2 className="text-lg font-semibold mb-3">Sản phẩm</h2>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border p-3"
                  >
                    {item.characterDesign?.imageUrl ? (
                      <img
                        src={item.characterDesign.imageUrl}
                        alt={item.characterDesign.name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1 text-sm">
                      <p className="font-medium">{item.characterDesign?.name || 'Thiết kế'}</p>
                      <p className="text-muted-foreground">
                        {item.sku?.category?.name} — {item.sku?.size?.name}
                      </p>
                      <p className="text-muted-foreground">SL: {item.quantity}</p>
                      <p className="font-semibold">
                        {formatCurrency(item.priceAtPurchase || item.sku?.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Status history */}
            <section>
              <h2 className="text-lg font-semibold mb-3">Lịch sử đơn hàng</h2>
              <div className="space-y-3">
                {order.statusHistory?.map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="w-px flex-1 bg-border" />
                    </div>
                    <div className="pb-3 text-sm">
                      <p className="font-medium">
                        {statusLabels[entry.status] || entry.status}
                      </p>
                      <p className="text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </p>
                      {entry.note && (
                        <p className="text-muted-foreground">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
