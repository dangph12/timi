import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { getOrder } from '@/services/orders';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Package } from 'lucide-react';
import { STATUS, STATUS_COLORS, formatCurrency, formatDate } from '@/constants/order';

function Label({ children }) {
  return <span className="text-sm text-muted-foreground">{children}</span>;
}

export default function OrderDetailPage() {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', publicId],
    queryFn: () => getOrder(publicId),
  });

  const title = order
    ? `Đơn hàng ${publicId} - Tỉ Mỉ`
    : 'Đơn hàng - Tỉ Mỉ';

  return (
    <>
      <title>{title}</title>
      <div className="mx-auto max-w-2xl px-4 pb-8">
        <Button
          variant="ghost"
          className="mb-4 -ml-2"
          onClick={() => navigate('/don-hang')}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : !order ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-xl font-semibold text-muted-foreground">
              Không tìm thấy đơn hàng
            </p>
            <Button variant="outline" onClick={() => navigate('/don-hang')}>
              Quay lại danh sách
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight break-all">
                  {publicId}
                </h1>
                <span className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap ${STATUS_COLORS[order.currentStatus] || 'bg-primary/10 text-primary'}`}>
                  {STATUS[order.currentStatus] || order.currentStatus}
                </span>
              </div>
              {order.createdAt && (
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              )}
            </div>

            {/* Customer info */}
            <section className="border-t border-border pt-6">
              <h2 className="text-base font-black font-heading mb-4">Thông tin khách hàng</h2>
              <div className="space-y-2 text-sm leading-relaxed">
                <p><Label>Tên:</Label> {order.account?.fullName || '—'}</p>
                <p><Label>Email:</Label> {order.email || '—'}</p>
                <p><Label>SĐT:</Label> {order.account?.phone || '—'}</p>
                <p><Label>Địa chỉ:</Label> {order.address || '—'}</p>
                {order.note && <p><Label>Ghi chú:</Label> {order.note}</p>}
              </div>
            </section>

            {/* Order info */}
            <section className="border-t border-border pt-6">
              <h2 className="text-base font-black font-heading mb-4">Chi tiết đơn hàng</h2>
              <div className="space-y-2 text-sm leading-relaxed">
                <p>
                  <Label>Phương thức TT:</Label>{' '}
                  {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                </p>
                <p>
                  <Label>Tình trạng TT:</Label>{' '}
                  {order.currentPaymentStatus === 'PENDING' ? 'Chờ thanh toán' : order.currentPaymentStatus}
                </p>
                <p><Label>Ngày tạo:</Label> {formatDate(order.createdAt)}</p>
                {order.expiresAt && (
                  <p><Label>Hết hạn:</Label> {formatDate(order.expiresAt)}</p>
                )}
              </div>
            </section>

            {/* Total */}
            <div className="border-t border-border pt-6 flex items-baseline justify-between">
              <span className="text-base font-black font-heading">Tổng cộng</span>
              <span className="text-xl sm:text-2xl font-black text-primary tabular-nums">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>

            {/* Products */}
            <section className="border-t border-border pt-6">
              <h2 className="text-base font-black font-heading mb-4">Sản phẩm</h2>
              <div className="divide-y divide-border">
                {order.items?.map((item) => {
                  const unitPrice = item.priceAtPurchase || item.sku?.price || 0;
                  return (
                    <div key={item.id} className="flex gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0">
                      {item.characterDesign?.imageUrl ? (
                        <img
                          src={item.characterDesign.imageUrl}
                          alt={item.characterDesign.name}
                          className="h-20 w-14 sm:h-24 sm:w-16 rounded-md object-cover shrink-0 bg-muted"
                        />
                      ) : (
                        <div className="flex h-20 w-14 sm:h-24 sm:w-16 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-heading font-bold text-sm sm:text-base truncate">
                          {item.characterDesign?.name || 'Thiết kế'}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {item.sku?.category?.name}
                          {item.sku?.category?.name && item.sku?.size?.name ? ' — ' : ''}
                          {item.sku?.size?.name}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                          <p className="text-sm sm:text-base font-black tabular-nums">
                            {formatCurrency(unitPrice * item.quantity)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground/60">
                          {formatCurrency(unitPrice)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Timeline */}
            <section className="border-t border-border pt-6">
              <h2 className="text-base font-black font-heading mb-4">Lịch sử đơn hàng</h2>
              <div className="space-y-0">
                {order.statusHistory?.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4 pb-6 last:pb-0 relative">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full z-10 ring-2 ${index === 0 ? 'bg-primary ring-primary/20' : 'bg-border ring-border/50'}`} />
                      {index < order.statusHistory.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border" />
                      )}
                    </div>
                    <div className="text-sm pt-0.5">
                      <p className={`font-semibold ${index === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {STATUS[entry.status] || entry.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </p>
                      {entry.note && (
                        <p className="text-muted-foreground text-xs mt-1">{entry.note}</p>
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
