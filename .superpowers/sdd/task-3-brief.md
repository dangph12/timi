### Task 3: New services for parts API

**Files:**
- Create: `src/services/parts.js`

**Interfaces:**
- Produces:
  - `getParts() => Promise<Part[]>` — Part: `{ id: number, name: string, layerOrder: number, allowMultiSelect: boolean }`
  - `getPartOptions(partId: number, styleId?: number) => Promise<Option[]>` — Option: `{ id: number, name: string, partId: number, styleId: number|null, imageUrl: string, deltaX: number, deltaY: number, deltaScale: number, rotation: number, mutexGroupKey: string | null }`

- [ ] **Step 1: Create src/services/parts.js**

```js
import { api } from '@/lib/api';

export const getParts = () => api.get('v1/parts').json();

export const getPartOptions = (partId, styleId) => {
  const searchParams = styleId != null ? { styleId } : {};
  return api.get(`v1/parts/${partId}/options`, { searchParams }).json();
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/parts.js
git commit -m "feat: add parts API service (getParts, getPartOptions)"
```

---

