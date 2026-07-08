export default function SkuPriceDisplay({ selectedSku, quantity }) {
  if (!selectedSku) return null;

  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-blue-50/30 rounded-lg border border-blue-100">
      <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">
        Price
      </span>
      <span className="text-sm font-black text-[#0000D0] tracking-wider">
        {(selectedSku.price * quantity).toLocaleString('vi-VN')}đ
      </span>
    </div>
  );
}
