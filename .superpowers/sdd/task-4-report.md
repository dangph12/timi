# Task 4: Create usePartsData hook — Complete

**Commit:** 81b5ac6

## Done
- Created `src/app/design/_hooks/usePartsData.js` with `useParts()` and `usePartOptions(partId)` hooks
- `useParts()` — fetches all parts sorted by id, staleTime Infinity
- `usePartOptions(partId)` — uses `styleId` from `designSelectionsAtom`; body (partId=1) fetches always, others only when `styleId != null`
- Committed with message: `feat: add usePartsData hook (parts list + per-part options)`
