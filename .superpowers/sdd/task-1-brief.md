# Task 1: Install sonner + add Toaster to layout

**Files:**
- Modify: `package.json`
- Modify: `src/components/layout.jsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<Toaster />` component available globally in app

**Steps:**
1. Run `pnpm add sonner`
2. Replace `src/components/layout.jsx` with content that imports `{ Toaster } from "sonner"` and adds `<Toaster />` component after the main content div but inside the Layout component's return.
3. Commit with message: `feat: add sonner toast + Toaster to layout`

**Current layout.jsx:**
```jsx
import { Outlet } from "react-router";
import Header from "@/components/header";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
```

**Expected final layout.jsx:**
```jsx
import { Outlet } from "react-router";
import Header from "@/components/header";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}
```

**Commit command:**
```bash
git add package.json pnpm-lock.yaml src/components/layout.jsx
git commit -m "feat: add sonner toast + Toaster to layout"
```
