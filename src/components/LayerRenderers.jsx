import { CLOTHES } from '@/constants/clothes';
import { HAIR_OPTIONS } from '@/constants/hair';
import CanvasImageLayer from '@/components/CanvasImageLayer';

const CLOTHES_CATEGORY_ORDER = { shirt: 0, pant: 1 };

const CATEGORY_CONFIG = {
  hair_bottom: {
    multi: false,
    selectionKey: 'hair',
    srcTemplate: id => `/hair-bottom/${id}.png`,
    guard: sel => {
      const opt = HAIR_OPTIONS.find(h => h.id === sel);
      return opt?.hasBottom ?? false;
    }
  },
  clothes: {
    multi: true,
    selectionKey: 'clothes',
    srcTemplate: id => `/clothes/${id}.png`,
    sort: ids =>
      [...ids].sort((a, b) => {
        const catOf = id => CLOTHES.find(c => c.id === id)?.category ?? '';
        return (
          (CLOTHES_CATEGORY_ORDER[catOf(a)] ?? 99) -
          (CLOTHES_CATEGORY_ORDER[catOf(b)] ?? 99)
        );
      })
  },
  accessory: {
    multi: true,
    selectionKey: 'accessory',
    srcTemplate: id => `/accessory/${id}.png`,
    passesRotation: true
  },
  hair: {
    multi: false,
    selectionKey: 'hair',
    srcTemplate: id => `/hair-top/${id}.png`
  },
  version: {
    multi: false,
    selectionKey: 'version',
    srcTemplate: id => `/version/${id}.png`
  }
};

const DEFAULT_CONFIG = {
  multi: false,
  srcTemplate: (id, category) => `/${category}/${id}.png`
};

function getConfig(category) {
  const specific = CATEGORY_CONFIG[category];
  if (specific) {
    return {
      ...DEFAULT_CONFIG,
      ...specific,
      selectionKey: specific.selectionKey ?? category
    };
  }
  return { ...DEFAULT_CONFIG, selectionKey: category };
}

export function renderLayer(selections, getLayerProps, category) {
  const config = getConfig(category);
  const sel = selections[config.selectionKey];

  if (config.multi) {
    const ids = sel ? (config.sort ? config.sort(sel) : sel) : [];
    if (ids.length === 0) return null;
    return ids.map(id => {
      const props = getLayerProps(category, id);
      if (!props) return null;
      return (
        <CanvasImageLayer
          key={id}
          src={config.srcTemplate(id)}
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          rotation={config.passesRotation ? props.rotation || 0 : 0}
        />
      );
    });
  }

  if (!sel) return null;
  if (config.guard && !config.guard(sel)) return null;

  const props = getLayerProps(category, sel);
  if (!props) return null;

  return (
    <CanvasImageLayer
      key={category}
      src={config.srcTemplate(sel, category)}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      rotation={config.passesRotation ? props.rotation || 0 : 0}
    />
  );
}
