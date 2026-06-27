import { atom } from 'jotai';

export const designSelectionsAtom = atom({
  version: null,
  hair: null,
  eyes: null,
  lip: null,
  clothes: [],
  accessory: [],
  item: { type: null, color: null },
  packaging: null
});

export const canChooseClothesAtom = atom(
  get => get(designSelectionsAtom).version !== 'economy'
);

export const capturedCharacterAtom = atom(null);
