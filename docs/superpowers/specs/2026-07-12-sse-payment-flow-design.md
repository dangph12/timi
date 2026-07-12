# SSE Payment Flow — Design Spec

## Goal

Replace manual "COMPLETE ORDER" bank transfer confirmation with real-time payment status via Server-Sent Events (SSE). QR code uses `publicId` as VietQR `des` parameter for automatic webhook correlation.

## Flow

```
Checkout → POST /v1/orders → { id, publicId } → /payment
                                                    ├── Show VietQR with des=publicId (keep bank info)
                                                    ├── SSE /sse/orders/{publicId} (connect on mount)
                                                    ├── Button disabled
                                                    ├── SSE "payment-status" { status: "PAID" } → toast + enable button
                                                    └── Button click → navigate("/finish")
```

## Backend Contract (existing, no changes needed)

- `POST /v1/orders` returns `{ id, publicId }` (already documented by user)
- `GET /sse/orders/{publicId}` — SSE endpoint, sends `event: payment-status\ndata: {"status":"PAID"}`
- Only `PAID` event sent (by SePay webhook). UNPAID = state before event.
- No TTL, no PENDING/EXPIRED today.

## Frontend Changes

### 1. Store (`src/store/order.js`)
- Keep `orderAtom` (full order object including `id`, `publicId`, `customer`, `item`, `cart`)
- Add `orderPublicIdAtom` for the SSE subscription identifier
- Keep `orderIdAtom` as-is (still used)

### 2. Checkout page (`src/app/checkout/page.jsx`)
- On `POST /v1/orders` success: store `data.publicId` in atom (alongside existing `data.id`)
- `setOrder(...)` already stores full order — add `publicId` to the order object

### 3. Payment page (`src/app/payment/page.jsx`)
- Connect SSE on mount: `new EventSource(apiBaseUrl + "/sse/orders/" + publicId)` — read `VITE_API_BASE_URL` from env
- Listen `payment-status` event
- Parse JSON from `event.data`, check `status === "PAID"`
- On PAID: show toast, set `isPaid = true`
- Button disabled initially (`isPaid === false`), enabled when PAID received
- On button click: `navigate("/finish")` — no API call
- QR `des` = `publicId` instead of customer name+phone
- SSE cleanup on unmount (`EventSource.close()`)
- Keep existing bank transfer info (hardcoded TPBank details)
- Add sonner `<Toaster />` component (wrapper in main layout or page)

### 4. Toast (new dependency + component)
- Install `sonner` via pnpm
- Add shadcn `sonner` toast component (`npx shadcn@latest add sonner` or manual)
- Add `<Toaster />` to `Layout` component for global availability

### 5. Cleanup
- Delete `src/services/payments.js` (no longer used)
- Remove `createTransaction` mutation from payment page
- Remove `useMutation` / `@tanstack/react-query` import if not used elsewhere on page

## States

| State | UI |
|-------|-----|
| SSR connecting | "Waiting for payment confirmation..." (subtle text/spinner near button) |
| SSE connected, UNPAID | Button disabled, same text |
| SSE PAID | Toast "Payment confirmed!", button enables, text changes to "Payment confirmed! Continue →" |
| SSE error | "Connection issue — refresh page if you've paid" |
| Button click | navigate("/finish") |

## Non-Goals

- No PENDING/EXPIRED states (backend doesn't send them)
- No auto-redirect (user explicitly requested button-only)
- No polling fallback (SSE is the source of truth)
- No changes to `/finish` page

## Dependencies Added

- `sonner` (npm package)

## Files Changed

| File | Action |
|------|--------|
| `src/store/order.js` | Add `publicId` to atom/state |
| `src/app/checkout/page.jsx` | Store `publicId` from API response |
| `src/app/payment/page.jsx` | SSE logic, disabled button, toast, QR with publicId |
| `src/components/layout.jsx` | Add `<Toaster />` |
| `src/services/payments.js` | Delete |
| `package.json` | Add `sonner` dep |
