import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { skuSelectionsAtom, selectedSkuAtom } from '@/store/sku';
import { designNameAtom } from '@/store/design';
import { useSkus } from '@/app/thiet-ke/_hooks/useSkusData';
import OptionCard from './OptionCard';
import QuantityInput from './QuantityInput';
import StepContinue from './StepContinue';
import SkuPriceDisplay from './SkuPriceDisplay';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

function buildCombos(skus) {
  const combos = new Set();
  for (const sku of skus) {
    if (sku.quantity > 0) combos.add(`${sku.category.id}-${sku.size.id}`);
  }
  return combos;
}

function deriveCategories(skus) {
  const seen = new Map();
  for (const sku of skus) {
    if (!seen.has(sku.category.id)) seen.set(sku.category.id, sku.category);
  }
  return Array.from(seen.values());
}

function deriveSizes(skus) {
  const seen = new Map();
  for (const sku of skus) {
    if (!seen.has(sku.size.id)) seen.set(sku.size.id, sku.size);
  }
  return Array.from(seen.values());
}

export default function SkuSelector({ onContinue, isPending = false, onAddToCart, isAddingToCart = false }) {
  const { data: skus, isLoading, error } = useSkus();
  const [selections, setSelections] = useAtom(skuSelectionsAtom);
  const selectedSku = useAtomValue(selectedSkuAtom);
  const [designName, setDesignName] = useAtom(designNameAtom);
  const { categoryId, sizeId, quantity } = selections;

  const categories = useMemo(() => (skus ? deriveCategories(skus) : []), [skus]);
  const sizes = useMemo(() => (skus ? deriveSizes(skus) : []), [skus]);

  const disabledCategoryIds = useMemo(() => {
    if (!skus) return new Set();
    if (categoryId) return new Set();
    const combos = buildCombos(skus);
    const disabled = new Set();
    for (const cat of categories) {
      if (sizeId) {
        if (!combos.has(`${cat.id}-${sizeId}`)) disabled.add(cat.id);
      } else {
        let hasAny = false;
        for (const s of sizes) {
          if (combos.has(`${cat.id}-${s.id}`)) { hasAny = true; break; }
        }
        if (!hasAny) disabled.add(cat.id);
      }
    }
    return disabled;
  }, [skus, categoryId, sizeId, categories, sizes]);

  const disabledSizeIds = useMemo(() => {
    if (!skus) return new Set();
    if (sizeId) return new Set();
    const combos = buildCombos(skus);
    const disabled = new Set();
    for (const s of sizes) {
      if (categoryId) {
        if (!combos.has(`${categoryId}-${s.id}`)) disabled.add(s.id);
      } else {
        let hasAny = false;
        for (const cat of categories) {
          if (combos.has(`${cat.id}-${s.id}`)) { hasAny = true; break; }
        }
        if (!hasAny) disabled.add(s.id);
      }
    }
    return disabled;
  }, [skus, categoryId, sizeId, categories, sizes]);

  function handleCategorySelect(category) {
    setSelections((prev) => {
      const newId = prev.categoryId === category.id ? null : category.id;
      return { ...prev, categoryId: newId };
    });
  }

  function handleSizeSelect(size) {
    setSelections((prev) => ({
      ...prev,
      sizeId: prev.sizeId === size.id ? null : size.id,
    }));
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-3 w-24 rounded" />
      <div className="grid grid-cols-2 gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-4/3 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-3 w-16 rounded" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive text-sm">
        Không thể tải tùy chọn sản phẩm. Vui lòng thử lại.
      </div>
    );
  }

  const maxQty = selectedSku?.quantity ?? 0;
  const canContinue = selectedSku != null && selectedSku.quantity > 0;

  return (
    <>
      <div className="mb-6">
        <p className="text-xs text-muted-foreground font-semibold mb-2 tracking-wide">
          Tên nhân vật
        </p>
        <Input
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          className="h-11 rounded-lg"
          placeholder="Nhân vật của tôi"
        />
      </div>

      <p className="text-xs text-muted-foreground font-semibold mb-3 tracking-wide">
        Chọn danh mục
      </p>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {categories.map((cat) => (
          <OptionCard
            key={cat.id}
            label={cat.name}
            imageSrc={cat.imageUrl}
            isSelected={categoryId === cat.id}
            onSelect={() => handleCategorySelect(cat)}
            disabled={disabledCategoryIds.has(cat.id)}
            imageScale={110}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground font-semibold mb-4 tracking-wide">
        Chọn kích thước
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {sizes.map((s) => {
          const isSelected = sizeId === s.id;
          const isDisabled = disabledSizeIds.has(s.id);

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSizeSelect(s)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-bold tracking-wider uppercase transition-all duration-200 ${
                isSelected
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border text-muted-foreground hover:border-foreground/20'
              } ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">
          Số lượng
        </span>
        <QuantityInput
          value={quantity}
          max={maxQty || 1}
          onChange={(qty) => setSelections((prev) => ({ ...prev, quantity: qty }))}
        />
      </div>

      <SkuPriceDisplay selectedSku={selectedSku} quantity={quantity} />

      {onAddToCart ? (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border/80 z-50 flex gap-3 md:static md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none md:z-auto md:mt-4">
          <Button
            className="flex-1 py-4 text-xs font-black bg-primary hover:bg-primary/80 text-white tracking-widest rounded-full h-11 transition-all shadow-md active:scale-[0.98]"
            onClick={onContinue}
            disabled={!canContinue || isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                ĐANG XỬ LÝ...
              </span>
            ) : (
              'MUA NGAY'
            )}
          </Button>
          <Button
            disabled={!canContinue || isAddingToCart}
            onClick={onAddToCart}
            variant="outline"
            className="flex-1 py-4 text-xs font-black tracking-widest rounded-full h-11 transition-all active:scale-[0.98]"
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                ĐANG THÊM...
              </span>
            ) : (
              'THÊM VÀO GIỎ'
            )}
          </Button>
        </div>
      ) : (
        <StepContinue
          disabled={!canContinue}
          onClick={onContinue}
          label="THANH TOÁN"
          isPending={isPending}
        />
      )}
    </>
  );
}
