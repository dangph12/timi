import { atom } from 'jotai';

export const designSelectionsAtom = atom({
  version: null,
  hair: null,
  eyes: null,
  lip: null,
  clothes: [],
  accessory: null,
  item: null,
  packaging: null
});

export const canChooseClothesAtom = atom(
  get => get(designSelectionsAtom).version !== 'economy'
);
