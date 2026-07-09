import { atom } from 'jotai';

export const designSelectionsAtom = atom({
  styleId: null,
  selections: {}
});

export const partOptionsAtom = atom({});

export const capturedCharacterAtom = atom(null);

export const designIdAtom = atom(null);

export const designNameAtom = atom("My Character");
