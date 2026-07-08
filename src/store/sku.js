import { atom } from 'jotai';

export const skusAtom = atom([]);

export const skuSelectionsAtom = atom({
  categoryId: null,
  sizeId: null,
  quantity: 1,
});

export const selectedSkuAtom = atom((get) => {
  const skus = get(skusAtom);
  const { categoryId, sizeId } = get(skuSelectionsAtom);
  if (!categoryId || !sizeId) return null;
  return skus.find(s => s.category.id === categoryId && s.size.id === sizeId) || null;
});
