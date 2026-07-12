# Task 2: Add orderPublicIdAtom to store

**Files:**
- Modify: `src/store/order.js`

**Interfaces:**
- Consumes: `atom` from jotai
- Produces: `orderPublicIdAtom` — stores the publicId string from order creation response

**Goal:** Add a new jotai atom `orderPublicIdAtom` alongside the existing atoms.

**Current src/store/order.js:**
```js
import { atom } from 'jotai';

export const orderAtom = atom(null);

export const cartAtom = atom(
  (get) => get(orderAtom)?.cart || null
);

export const customerAtom = atom(
  (get) => get(orderAtom)?.customer || null
);

export const orderIdAtom = atom(null);
```

**Expected final src/store/order.js:**
```js
import { atom } from 'jotai';

export const orderAtom = atom(null);

export const cartAtom = atom(
  (get) => get(orderAtom)?.cart || null
);

export const customerAtom = atom(
  (get) => get(orderAtom)?.customer || null
);

export const orderIdAtom = atom(null);

export const orderPublicIdAtom = atom(null);
```

**Commit command:**
```bash
git add src/store/order.js
git commit -m "feat: add orderPublicIdAtom for SSE subscription"
```
