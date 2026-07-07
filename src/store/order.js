import { atom } from 'jotai';

// Atom for the full order object
export const orderAtom = atom(null);

// Derived atoms for specific parts if needed
export const cartAtom = atom(
  (get) => get(orderAtom)?.cart || null
);

export const customerAtom = atom(
  (get) => get(orderAtom)?.customer || null
);

export const orderIdAtom = atom(null);
