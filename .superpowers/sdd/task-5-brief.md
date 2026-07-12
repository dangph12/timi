# Task 5: Delete unused payments service

**Files:**
- Delete: `src/services/payments.js`

**Interfaces:**
- Removes: `createTransaction` function (no longer used — payment page no longer calls it)

**Goal:** Remove the unused payments service that handled the old manual "Complete Order" flow.

**Steps:**

1. Verify no remaining imports of `payments.js` in the codebase:
   Run: `rg "payments" src/`
   Expected: No matches.

2. Delete the file:
   Run: `Remove-Item -LiteralPath "src/services/payments.js"`

**Commit command:**
```bash
git add -A
git commit -m "chore: remove unused payments service"
```
