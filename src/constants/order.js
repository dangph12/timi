export const STATUS = {
  CREATED: 'Đã tạo',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export const STATUS_COLORS = {
  CREATED: 'bg-primary/10 text-primary',
  PROCESSING: 'bg-primary/10 text-primary',
  SHIPPED: 'bg-primary/10 text-primary',
  DELIVERED: 'bg-muted-foreground/10 text-muted-foreground',
  COMPLETED: 'bg-muted-foreground/10 text-muted-foreground',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
