### Task 5: Delete old constants and selectors

**Files:**
- Delete: `src/constants/accessory.js`
- Delete: `src/constants/clothes.js`
- Delete: `src/constants/eyes.js`
- Delete: `src/constants/hair.js`
- Delete: `src/constants/lip.js`
- Delete: `src/constants/positions.js`
- Delete: `src/constants/elementCategories.js`
- Delete: `src/app/design/_components/VersionSelector.jsx`
- Delete: `src/app/design/_components/ItemSelector.jsx`
- Delete: `src/app/design/_components/PackagingSelector.jsx`
- Delete: `src/app/design/_components/HairSelector.jsx`
- Delete: `src/app/design/_components/EyesSelector.jsx`
- Delete: `src/app/design/_components/LipSelector.jsx`
- Delete: `src/app/design/_components/ClothesSelector.jsx`
- Delete: `src/app/design/_components/AccessorySelector.jsx`

**Goal:** Remove all hardcoded part/option/offset data files and category-specific selectors.

- [ ] **Step 1: Delete all 15 files**

```powershell
Remove-Item -LiteralPath "src/constants/accessory.js"
Remove-Item -LiteralPath "src/constants/clothes.js"
Remove-Item -LiteralPath "src/constants/eyes.js"
Remove-Item -LiteralPath "src/constants/hair.js"
Remove-Item -LiteralPath "src/constants/lip.js"
Remove-Item -LiteralPath "src/constants/positions.js"
Remove-Item -LiteralPath "src/constants/elementCategories.js"
Remove-Item -LiteralPath "src/app/design/_components/VersionSelector.jsx"
Remove-Item -LiteralPath "src/app/design/_components/ItemSelector.jsx"
Remove-Item -LiteralPath "src/app/design/_components/PackagingSelector.jsx"
Remove-Item -LiteralPath "src/app/design/_components/HairSelector.jsx"
Remove-Item -LiteralPath "src/app/design/_components/EyesSelector.jsx"
Remove-Item -LiteralPath "src/app/design/_components/LipSelector.jsx"
Remove-Item -LiteralPath "src/app/design/_components/ClothesSelector.jsx"
Remove-Item -LiteralPath "src/app/design/_components/AccessorySelector.jsx"
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: delete old constants and category-specific selectors"
```

---

