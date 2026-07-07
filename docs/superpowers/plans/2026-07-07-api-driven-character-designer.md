# Migrate Character Designer to API-Driven Data — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded part/option/offset data with API-fetched data from `GET /v1/parts` and `GET /v1/parts/{id}/options?styleId={styleId}`, removing version/item/packaging steps and consolidating selectors into a single generic `PartSelector`.

**Architecture:** API returns 8 parts (Thân, Tóc mái, Tóc sau, Mắt, Miệng, Áo, Quần, Phụ kiện). First selection (Thân, part 1) sets `styleId`, which filters all subsequent `GET /v1/parts/{id}/options` calls. Each option carries its own `deltaX/Y/Scale/rotation` and `imageUrl` (Cloudinary), eliminating all offset maps. A generic `PartSelector` component replaces all 5 category-specific selectors. Layer rendering uses `imageUrl` and per-option positioning directly.

**Tech Stack:** React 19, Vite 8, Jotai, TanStack React Query v5, ky, Konva/react-konva, Tailwind CSS 4

## Global Constraints

- No version/item/packaging steps (removed per user)
- Body (Thân) is a selectable part (part 1), not a hardcoded base image
- `styleId` determined by first selection (part 1 = Thân)
- `mutexGroupKey` from API option data replaces hardcoded `ACCESSORY_MUTEX_GROUPS`
- `allowMultiSelect` from API part data replaces hardcoded multi/single config
- `layerOrder` from API part data replaces `LAYER_ORDER` array
- `imageUrl` from API (Cloudinary URLs) replaces local `/category/id.png` paths
- Design submission shape unchanged: `{ name, imageUrl, partSelections: [{ partOptionId: number }] }`
- API response envelope: `{ status: string, message: string, data: T }` — parseJson unwraps `data`
- Parts from API sorted by `id` ascending
- All constant files in `src/constants/` get deleted
- Category-specific selector components get deleted
- `OptionCard.jsx` and `StepContinue.jsx` are kept and reused
- Layer positions computed from option's `deltaX/Y/Scale/rotation` relative to body image canvas bounds
- No version-based offset maps, no hat-on-hair tweaks, no category-level fallback offsets

---

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

### Task 6: Rewrite useLayerProps for API data

**Files:**
- Modify: `src/app/design/_hooks/useLayerProps.js:1-111`

**Interfaces:**
- Consumes: `designSelectionsAtom` from `@/store/design`, canvas width/height, body image dimensions
- Produces: `getLayerProps(partId, partOptions) => { x, y, width, height, rotation } | null`

**Goal:** Compute per-part canvas position from option's `deltaX/Y/Scale/rotation`, relative to body image canvas bounds. No version-based offsets, no hat tweaks, no category fallbacks. Body image anchors the coordinate system.

- [ ] **Step 1: Replace useLayerProps.js**

```js
import { useMemo } from 'react';

function calcBodyBounds(canvasWidth, canvasHeight, bodyImage) {
  const maxDim = Math.min(canvasWidth, canvasHeight) * 0.55;
  let w = maxDim;
  let h = maxDim;

  if (bodyImage?.width && bodyImage?.height) {
    const ratio = bodyImage.width / bodyImage.height;
    if (ratio > 1) {
      h = maxDim / ratio;
    } else {
      w = maxDim * ratio;
    }
  }

  return {
    x: canvasWidth / 2,
    y: canvasHeight / 2 - 35,
    width: w,
    height: h,
  };
}

export function useLayerProps(width, height, bodyImage) {
  const bodyBounds = useMemo(
    () => calcBodyBounds(width, height, bodyImage),
    [width, height, bodyImage]
  );

  return useMemo(() => {
    function getLayerProps(partId, partOptions) {
      const optionsArr = partOptions?.[partId];
      if (!optionsArr || optionsArr.length === 0) return null;

      const option = optionsArr[0];
      if (!option) return null;

      return {
        x: bodyBounds.x + bodyBounds.width * (option.deltaX || 0),
        y: bodyBounds.y + bodyBounds.height * (option.deltaY || 0),
        width: bodyBounds.width * (option.deltaScale || 1),
        height: bodyBounds.height * (option.deltaScale || 1),
        rotation: option.rotation || 0,
      };
    }

    return getLayerProps;
  }, [bodyBounds]);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/design/_hooks/useLayerProps.js
git commit -m "refactor: useLayerProps uses API delta offsets, no version maps"
```

---

### Task 7: Rewrite LayerRenderers for API data

**Files:**
- Modify: `src/components/LayerRenderers.jsx:1-106`

**Interfaces:**
- Consumes: `selections` from `designSelectionsAtom`, `getLayerProps(partId, partOptions)`, `parts: Part[]` (with layerOrder), `partOptions: Record<number, Option[]>`
- Produces: Array of React elements (Konva Image layers) sorted by `layerOrder`

**Goal:** Remove all `CATEGORY_CONFIG` / `DEFAULT_CONFIG` / local path templates. Use `option.imageUrl` and `option.rotation` directly. Multi-select parts render each selected option as its own layer. Sort by part's `layerOrder`.

- [ ] **Step 1: Replace LayerRenderers.jsx**

```js
import CanvasImageLayer from '@/components/CanvasImageLayer';

export function renderLayers(selections, getLayerProps, parts, partOptions) {
  if (!parts || !partOptions) return [];

  const sorted = [...parts].sort((a, b) => a.layerOrder - b.layerOrder);

  return sorted.flatMap(part => {
    const selected = selections.selections[part.id];
    if (selected == null) return [];

    const optionIds = Array.isArray(selected) ? selected : [selected];
    const options = partOptions[part.id] || [];

    return optionIds.map(optionId => {
      const option = options.find(o => o.id === optionId);
      if (!option) return null;

      const props = getLayerProps(part.id, partOptions);
      if (!props) return null;

      return (
        <CanvasImageLayer
          key={optionId}
          src={option.imageUrl}
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          rotation={option.rotation || 0}
        />
      );
    }).filter(Boolean);
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LayerRenderers.jsx
git commit -m "refactor: LayerRenderers uses API imageUrl and layerOrder"
```

---

### Task 8: Create generic PartSelector component

**Files:**
- Create: `src/app/design/_components/PartSelector.jsx`

**Interfaces:**
- Consumes: `designSelectionsAtom`, `partOptionsAtom` from `@/store/design`, `OptionCard`, `StepContinue`, `usePartOptions` from `@/app/design/_hooks/usePartsData`, `useSetAtom` from jotai
- Props: `{ part: Part, onContinue: () => void }`
- Produces: A selector UI handling single-select, multi-select with mutex, loading, error states. Also writes loaded option data to `partOptionsAtom` so the canvas can read all rendered parts' options.

- [ ] **Step 1: Create PartSelector.jsx**

```jsx
import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { designSelectionsAtom, partOptionsAtom } from '@/store/design';
import { usePartOptions } from '@/app/design/_hooks/usePartsData';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';
import { Skeleton } from '@/components/ui/skeleton';

export default function PartSelector({ part, onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);
  const setPartOptions = useSetAtom(partOptionsAtom);
  const { data: options, isLoading, error } = usePartOptions(part.id);

  useEffect(() => {
    if (options) {
      setPartOptions(prev => ({ ...prev, [part.id]: options }));
    }
  }, [options, part.id, setPartOptions]);

  const current = selections.selections[part.id];
  const isBody = part.id === 1;
  const isSelected = part.allowMultiSelect
    ? (Array.isArray(current) && current.length > 0)
    : (current != null);

  function handleSelect(option) {
    setSelections(prev => {
      if (isBody) {
        return {
          styleId: option.styleId,
          selections: { ...prev.selections, [part.id]: option.id }
        };
      }

      if (part.allowMultiSelect) {
        const currentValues = prev.selections[part.id] || [];
        const exists = currentValues.includes(option.id);

        if (exists) {
          return {
            ...prev,
            selections: {
              ...prev.selections,
              [part.id]: currentValues.filter(id => id !== option.id)
            }
          };
        }

        const mutexKey = option.mutexGroupKey;
        let filtered = currentValues;
        if (mutexKey) {
          filtered = currentValues.filter(id => {
            const other = options?.find(o => o.id === id);
            return other?.mutexGroupKey !== mutexKey;
          });
        }

        return {
          ...prev,
          selections: {
            ...prev.selections,
            [part.id]: [...filtered, option.id]
          }
        };
      }

      return {
        ...prev,
        selections: { ...prev.selections, [part.id]: option.id }
      };
    });
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-4/3 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 text-sm">
        Failed to load options. Please try again.
      </div>
    );
  }

  const showNotAvailable = !isBody && selections.styleId == null;

  return (
    <>
      <p className="text-xs text-muted-foreground font-semibold mb-4 tracking-wide">
        {showNotAvailable
          ? 'Select body first'
          : part.allowMultiSelect
            ? 'Choose (Optional)'
            : 'Choose one'}
      </p>

      {showNotAvailable ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Please select a body option first.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {options?.map(option => {
            const isActive = part.allowMultiSelect
              ? (Array.isArray(current) && current.includes(option.id))
              : (current === option.id);

            return (
              <OptionCard
                key={option.id}
                label={option.name}
                imageSrc={option.imageUrl}
                isSelected={isActive}
                onSelect={() => handleSelect(option)}
              />
            );
          })}
        </div>
      )}

      <StepContinue
        disabled={!isSelected && !part.allowMultiSelect}
        onClick={onContinue}
        label="CONTINUE →"
      />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/design/_components/PartSelector.jsx
git commit -m "feat: add generic PartSelector component"
```

---

### Task 9: Rewrite DesignCanvas for API data

**Files:**
- Modify: `src/app/design/_components/DesignCanvas.jsx:1-122`

**Interfaces:**
- Consumes: `designSelectionsAtom`, `partOptionsAtom` from `@/store/design`, `useParts()` hook, `useLayerProps()`, `renderLayers()`, `useImage` for body image, `CanvasImageLayer`
- Produces: Konva Stage with layers rendered from API data, no item/version/packaging preview, background gradient stays

**Goal:** Body is a selectable part rendered via its option's `imageUrl`. All layers sorted by `layerOrder` from API parts. Remove item preview. Remove hardcoded version image. Remove packaging group. `getCharacterDataUrl()` hides background then captures.

- [ ] **Step 1: Replace DesignCanvas.jsx**

```jsx
import { useAtomValue } from 'jotai';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { designSelectionsAtom, partOptionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Group } from 'react-konva';
import useImage from 'use-image';
import { useLayerProps } from '@/app/design/_hooks/useLayerProps';
import { renderLayers } from '@/components/LayerRenderers';
import { useParts } from '@/app/design/_hooks/usePartsData';

const DesignCanvas = forwardRef(function DesignCanvas({ width, height }, ref) {
  const selections = useAtomValue(designSelectionsAtom);
  const partOptions = useAtomValue(partOptionsAtom);
  const stageRef = useRef(null);
  const backgroundRef = useRef(null);

  const { data: parts } = useParts();

  const bodyOptionId = selections.selections[1];
  const bodyOptions = partOptions[1] || [];
  const bodyOption = bodyOptions.find(o => o.id === bodyOptionId);
  const [bodyImage] = useImage(bodyOption?.imageUrl || null);

  const getLayerProps = useLayerProps(width, height, bodyImage);

  useImperativeHandle(ref, () => ({
    getCharacterDataUrl() {
      if (!stageRef.current) return null;
      backgroundRef.current?.visible(false);
      stageRef.current.draw();
      const dataUrl = stageRef.current.toDataURL();
      backgroundRef.current?.visible(true);
      stageRef.current.draw();
      return dataUrl;
    }
  }));

  const layers = renderLayers(selections, getLayerProps, parts, partOptions);

  return (
    <Stage ref={stageRef} width={width} height={height}>
      <Layer>
        <Rect
          ref={backgroundRef}
          x={0}
          y={0}
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: height }}
          fillLinearGradientColorStops={[0, '#0000FF', 1, '#4A4AFF']}
        />
        {layers.map((element, i) => (
          <Group key={i}>
            {element}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
});

export default DesignCanvas;
```

- [ ] **Step 2: Commit**

```bash
git add src/app/design/_components/DesignCanvas.jsx
git commit -m "refactor: DesignCanvas uses API body image + partOptionsAtom"
```

---

### Task 10: Rewrite design page.jsx

**Files:**
- Modify: `src/app/design/page.jsx:1-185`

**Interfaces:**
- Consumes: `useParts()`, `PartSelector`, `DesignCanvas`, all Jotai atoms
- Produces: Dynamic step list from API parts sorted by id, collapsible accordion, design submission on last step

**Goal:** Replace hardcoded `sections` array with data-driven steps from `useParts()`. Each step renders `PartSelector` with the corresponding part. Submission on final step builds `partSelections` array from actual selections.

**Important:** `activeStep` is 1-indexed, array index is 0-indexed. Use `const stepIndex = activeStep - 1` for array access.

- [ ] **Step 1: Replace design/page.jsx**

```jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
  designSelectionsAtom,
  capturedCharacterAtom,
  designIdAtom,
} from "@/store/design";
import { useMutation } from "@tanstack/react-query";
import { createDesign } from "@/services/designs";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Header from "@/components/header";
import PartSelector from "./_components/PartSelector";
import DesignCanvas from "./_components/DesignCanvas";
import { useParts } from "@/app/design/_hooks/usePartsData";
import { Skeleton } from "@/components/ui/skeleton";

export default function DesignPage() {
  const [activeStep, setActiveStep] = useState(1);
  const canvasRef = useRef(null);
  const designCanvasRef = useRef(null);
  const sectionRefs = useRef({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();
  const setCapturedCharacter = useSetAtom(capturedCharacterAtom);
  const designSelections = useAtomValue(designSelectionsAtom);
  const setDesignId = useSetAtom(designIdAtom);

  const { data: parts, isLoading: partsLoading } = useParts();
  const sections = parts || [];
  const stepIndex = activeStep - 1;

  const designMutation = useMutation({
    mutationFn: createDesign,
    onSuccess: (data) => {
      setDesignId(data.id);
      navigate("/checkout");
    },
    onError: (error) => {
      console.error("Error creating design:", error);
    },
  });

  useEffect(() => {
    const activeRef = sectionRefs.current[activeStep];
    if (activeRef) {
      const timer = setTimeout(() => {
        activeRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleContinue = useCallback(() => {
    if (activeStep === sections.length) {
      const partSelections = [];
      Object.entries(designSelections.selections).forEach(([partId, val]) => {
        const ids = Array.isArray(val) ? val : [val];
        ids.forEach(id => {
          if (id != null) partSelections.push({ partOptionId: id });
        });
      });

      designMutation.mutate({
        name: "My Character",
        imageUrl: "data:image/png",
        partSelections,
      });
    } else {
      setActiveStep((prev) => Math.min(prev + 1, sections.length));
    }
  }, [activeStep, sections.length, designSelections, designMutation]);

  const title = "Design Your Character - Tỉ Mỉ";
  const description =
    "Customize your DIY box with unique hair, eyes, clothes, and accessories. Create your perfect character design.";

  if (partsLoading) {
    return (
      <>
        <title>{title}</title>
        <div className="flex h-screen flex-col font-sans overflow-hidden">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <Skeleton className="w-64 h-8 rounded" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="flex h-screen flex-col font-sans overflow-hidden">
        <Header />
        <div className="flex flex-col md:flex-row flex-1 w-full min-h-0 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 p-4 pb-28 md:pb-4 overflow-y-auto border-t md:border-t-0 md:border-r border-border order-2 md:order-1 flex-1">
            {sections.map((part, idx) => {
              const stepNum = idx + 1;
              const isCompleted = activeStep > stepNum;
              const isActive = activeStep === stepNum;

              return (
                <div
                  key={part.id}
                  ref={(el) => {
                    if (el) sectionRefs.current[stepNum] = el;
                  }}
                >
                  <Collapsible
                    open={isActive}
                    onOpenChange={(isOpen) => {
                      if (isOpen && isCompleted) setActiveStep(stepNum);
                    }}
                    className="mb-2 rounded-md"
                  >
                    <CollapsibleTrigger
                      className={`w-full p-4 font-bold text-left flex items-center gap-2 ${
                        isCompleted || isActive
                          ? "text-[#0000D0]"
                          : "text-muted-foreground"
                      }`}
                      disabled={stepNum > activeStep}
                    >
                      {isActive || isCompleted ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0000D0] text-white text-sm font-extrabold shrink-0">
                          {stepNum}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-muted-foreground/30 text-muted-foreground/70 text-sm font-bold shrink-0">
                          {stepNum}
                        </span>
                      )}
                      <span className="tracking-wide uppercase text-sm font-black">
                        {part.name}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 bg-muted/20 border-t border-border/40">
                      <div style={{ display: isActive ? "" : "none" }}>
                        <PartSelector
                          part={part}
                          onContinue={handleContinue}
                        />
                      </div>
                      {isCompleted && (
                        <p className="text-xs text-muted-foreground">
                          Completed
                        </p>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>

          {/* Right Canvas */}
          <div
            ref={canvasRef}
            className="w-full h-[40vh] md:h-full md:w-2/3 bg-muted order-1 md:order-2 shrink-0 md:shrink"
          >
            {size.width > 0 && (
              <DesignCanvas
                ref={designCanvasRef}
                width={size.width}
                height={size.height}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/design/page.jsx
git commit -m "refactor: data-driven design page from API parts"
```

---

### Task 11: Update checkout page

**Files:**
- Modify: `src/app/checkout/page.jsx:192-210`

**Goal:** Remove hardcoded "STANDARD VERSION" and "KEYRING" pricing lines from checkout sidebar since version/item steps are removed.

- [ ] **Step 1: Remove version and item pricing lines, replace with single line**

Find lines 199-217 in checkout/page.jsx and replace with:
```jsx
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-none bg-foreground" />
                    <span className="text-sm tracking-wide">TỈ MỈ DIY BOX</span>
                  </div>
                  <span className="text-sm">179.000đ</span>
                </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/checkout/page.jsx
git commit -m "refactor: remove version/item pricing from checkout"
```

---

### Task 12: Update sample-data schema

**Files:**
- Modify: `src/schemas/sample-data.js:1-19`

**Goal:** Remove `sampleCharacterDesign` (no longer used — page.jsx builds `partSelections` dynamically). Keep `sampleOrder`.

- [ ] **Step 1: Remove sampleCharacterDesign**

Replace file content with:
```js
export const sampleOrder = {
  email: "customer@example.com",
  phone: "0912345678",
  address: "123 Nguyen Hue, District 1, HCMC",
  accountId: null,
  items: [
    {
      skuId: 1,
      characterDesignId: 42,
      quantity: 1,
    },
  ],
};
```

- [ ] **Step 2: Verify `sampleCharacterDesign` is not imported anywhere**

```bash
rg "sampleCharacterDesign" src/
```
Expected: No matches.

- [ ] **Step 3: Commit**

```bash
git add src/schemas/sample-data.js
git commit -m "chore: remove unused sampleCharacterDesign"
```

---

### Task 13: Integration — verify no dangling imports and build compiles

**Files:**
- Modify: none (verification only)

- [ ] **Step 1: Verify no imports of deleted modules remain**

```bash
rg "from '@/constants/(accessory|clothes|eyes|hair|lip|positions|elementCategories)'" src/
```
Expected: No matches.

- [ ] **Step 2: Verify no imports of deleted selectors remain**

```bash
rg "from.*/(VersionSelector|HairSelector|EyesSelector|LipSelector|ClothesSelector|AccessorySelector|ItemSelector|PackagingSelector)" src/
```
Expected: No matches.

- [ ] **Step 3: Try build**

```bash
npx vite build 2>&1
```
Expected: Build succeeds (or only warnings about unused imports in unrelated files).
