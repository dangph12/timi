import { CLOTHES } from '@/constants/clothes';
import CanvasImageLayer from '@/components/CanvasImageLayer';
import { HAIR_OPTIONS } from '@/constants/hair';

const IMAGE_SRC = {
  clothes: id => `/clothes/${id}.png`,
  accessory: id => `/accessory/${id}.png`,
  hair: id => `/hair-top/${id}.png`,
  hair_bottom: id => `/hair-bottom/${id}.png`,
  default: (id, category) => `/${category}/${id}.png`,
};

const CLOTHES_CATEGORY_ORDER = { pant: 0, skirt: 1, shirt: 2 };

function renderClothes(selections, getLayerProps) {
  const activeIds = selections.clothes || [];
  if (activeIds.length === 0) return null;

  const sorted = [...activeIds].sort((a, b) => {
    const catA = CLOTHES.find(c => c.id === a)?.category ?? '';
    const catB = CLOTHES.find(c => c.id === b)?.category ?? '';
    return (CLOTHES_CATEGORY_ORDER[catA] ?? 99) - (CLOTHES_CATEGORY_ORDER[catB] ?? 99);
  });

  return sorted.map(id => {
    const props = getLayerProps('clothes', id);
    if (!props) return null;
    return (
      <CanvasImageLayer
        key={id}
        src={IMAGE_SRC.clothes(id)}
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
      />
    );
  });
}

function renderAccessory(selections, getLayerProps) {
  const activeAccs = selections.accessory || [];
  if (activeAccs.length === 0) return null;

  return activeAccs.map(accId => {
    const props = getLayerProps('accessory', accId);
    if (!props) return null;
    return (
      <CanvasImageLayer
        key={accId}
        src={IMAGE_SRC.accessory(accId)}
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
      />
    );
  });
}

function renderHairTop(selections, getLayerProps) {
  const sel = selections.hair;
  if (!sel) return null;

  const props = getLayerProps('hair', sel);
  if (!props) return null;

  return (
    <CanvasImageLayer
      key='hair'
      src={IMAGE_SRC.hair(sel)}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
  );
}

function renderHairBottom(selections, getLayerProps) {
  const sel = selections.hair;
  if (!sel) return null;

  const hairOption = HAIR_OPTIONS.find(h => h.id === sel);
  if (!hairOption || !hairOption.hasBottom) return null;

  const props = getLayerProps('hair_bottom', sel);
  if (!props) return null;

  return (
    <CanvasImageLayer
      key='hair_bottom'
      src={IMAGE_SRC.hair_bottom(sel)}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
  );
}

function renderSingleSelect(selections, getLayerProps, category) {
  const sel = selections[category];
  if (!sel) return null;

  const props = getLayerProps(category);
  if (!props) return null;

  return (
    <CanvasImageLayer
      key={category}
      src={IMAGE_SRC.default(sel, category)}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
  );
}

export const LAYER_RENDERERS = {
  clothes: renderClothes,
  accessory: renderAccessory,
  hair: renderHairTop,
  hair_bottom: renderHairBottom,
  default: renderSingleSelect,
};
