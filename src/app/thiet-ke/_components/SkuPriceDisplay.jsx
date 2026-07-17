export default function SkuPriceDisplay({ selectedSku, quantity }) {
  if (!selectedSku) return null;

  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
      <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">
        Giá
      </span>
      <span className="text-sm font-black text-primary tracking-wider">
        {(selectedSku.price * quantity).toLocaleString('vi-VN')}đ
      </span>
    </div>
  );
}
