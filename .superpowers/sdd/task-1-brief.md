### Task 1: Fix API parseJson for array responses

**Files:**
- Modify: `src/lib/api.js:6-9`

**Interfaces:**
- Produces: `api.get('v1/parts').json()` returns `Part[]`, not indexed object

**Goal:** The existing `parseJson` spreads array data into object keys (e.g., `{0: item, 1: item}`). GET endpoints return arrays in the `data` field. Fix to return arrays unchanged with `status`/`message` attached.

- [ ] **Step 1: Update parseJson in api.js**

Replace:
```js
  parseJson: (text) => {
    const { status, message, data } = JSON.parse(text);
    return { ...data, status, message };
  }
```
With:
```js
  parseJson: (text) => {
    const { status, message, data } = JSON.parse(text);
    if (Array.isArray(data)) {
      data.status = status;
      data.message = message;
      return data;
    }
    return { ...data, status, message };
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/api.js
git commit -m "fix: handle array responses in api parseJson"
```

---

