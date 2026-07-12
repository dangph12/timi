# Task 3: Update checkout page to store publicId

**Files:**
- Modify: `src/app/checkout/page.jsx`

**Interfaces:**
- Consumes: `orderPublicIdAtom` from `@/store/order`, `createOrder` from `@/services/orders`
- Produces: stores `publicId` from `POST /v1/orders` response into atom

**Goal:** When the checkout page creates an order, store the `publicId` from the API response so the payment page can use it for SSE subscription.

**Changes needed:**

1. Add `orderPublicIdAtom` to the import from `@/store/order`:

Current import:
```js
import { orderIdAtom, orderAtom } from "@/store/order";
```
Change to:
```js
import { orderIdAtom, orderAtom, orderPublicIdAtom } from "@/store/order";
```

2. Add `useSetAtom` for `orderPublicIdAtom` near the other setters (around line 24):

Current:
```js
const setOrderId = useSetAtom(orderIdAtom);
const setOrder = useSetAtom(orderAtom);
```
Change to:
```js
const setOrderId = useSetAtom(orderIdAtom);
const setOrder = useSetAtom(orderAtom);
const setOrderPublicId = useSetAtom(orderPublicIdAtom);
```

3. Update the `onSuccess` callback to store `publicId`:

Current (around line 70-74):
```js
    onSuccess: (data) => {
      setOrderId(data.id);
      setOrder((prev) => ({ ...prev, id: data.id }));
      navigate("/payment");
    },
```
Change to:
```js
    onSuccess: (data) => {
      setOrderId(data.id);
      setOrderPublicId(data.publicId);
      setOrder((prev) => ({ ...prev, id: data.id, publicId: data.publicId }));
      navigate("/payment");
    },
```

**Commit command:**
```bash
git add src/app/checkout/page.jsx
git commit -m "feat: store publicId on order creation"
```
