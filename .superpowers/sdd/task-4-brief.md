### Task 4: Create usePartsData hook

**Files:**
- Create: `src/app/design/_hooks/usePartsData.js`

**Interfaces:**
- Consumes: `getParts`, `getPartOptions` from `@/services/parts`, `useQuery` from `@tanstack/react-query`
- Produces:
  - `useParts() => { data: Part[], isLoading, error }` — sorted by id (staleTime: Infinity)
  - `usePartOptions(partId, enabled) => { data: Option[], isLoading, error }` — fetches with current styleId from store, `enabled` gates on styleId for non-body parts

**Goal:** Two React Query hooks. `useParts` fetches part list once. `usePartOptions(partId)` fetches options for a specific part, using `styleId` from `designSelectionsAtom`. Body (part 1) fetches without styleId; other parts only fetch when `styleId != null`.

- [ ] **Step 1: Create usePartsData.js**

```js
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { getParts, getPartOptions } from '@/services/parts';
import { designSelectionsAtom } from '@/store/design';

export function useParts() {
  return useQuery({
    queryKey: ['parts'],
    queryFn: getParts,
    staleTime: Infinity,
  });
}

export function usePartOptions(partId) {
  const selections = useAtomValue(designSelectionsAtom);
  const enabled = selections.styleId != null || partId === 1;

  return useQuery({
    queryKey: ['partOptions', partId, selections.styleId],
    queryFn: () => getPartOptions(partId, selections.styleId),
    enabled,
    staleTime: Infinity,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/design/_hooks/usePartsData.js
git commit -m "feat: add usePartsData hook (parts list + per-part options)"
```

---

