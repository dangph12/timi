import { atom } from 'jotai';

export const accessTokenAtom = atom(null);
export const userAtom = atom(null);
export const isAuthenticatedAtom = atom((get) => !!get(accessTokenAtom));
