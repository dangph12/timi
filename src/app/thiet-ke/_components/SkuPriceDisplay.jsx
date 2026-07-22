export default function SkuPriceDisplay({ selectedSku, quantity }) {
  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
      <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">
        Giá
      </span>
      <span className="text-sm font-black text-primary tracking-wider">
        {(selectedSku ? selectedSku.price * quantity : 0).toLocaleString('vi-VN')}đ
      </span>
    </div>
  );
}
