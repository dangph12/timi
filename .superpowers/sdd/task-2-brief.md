### Task 2: Rewrite design store atom

**Files:**
- Modify: `src/store/design.js:1-20`

**Interfaces:**
- Consumes: `atom` from jotai
- Produces:
  - `designSelectionsAtom` — `{ styleId: number | null, selections: Record<number, number | number[]> }`
  - `partOptionsAtom` — `Record<number, Option[]>`, accumulates options per part as they load
  - Removes: `canChooseClothesAtom` (no more version), `version`, `hair`, `eyes`, `lip`, `clothes`, `accessory`, `item`, `packaging` fields
  - Keeps: `capturedCharacterAtom`, `designIdAtom`

**Goal:** New atom shape. `selections` keys are part IDs (1-8). Values are option IDs (single-select parts) or option ID arrays (multi-select parts). Also adds `partOptionsAtom` so `DesignCanvas` can read loaded options from all completed steps.

- [ ] **Step 1: Replace store/design.js**

```js
import { atom } from 'jotai';

export const designSelectionsAtom = atom({
  styleId: null,
  selections: {}
});

export const partOptionsAtom = atom({});

export const capturedCharacterAtom = atom(null);

export const designIdAtom = atom(null);
```

- [ ] **Step 2: Search codebase for `canChooseClothesAtom` references and confirm no remaining imports**

```bash
rg "canChooseClothesAtom" src/
```

- [ ] **Step 3: Commit**

```bash
git add src/store/design.js
git commit -m "refactor: new designSelections shape (styleId + partId map) + partOptionsAtom"
```

---

