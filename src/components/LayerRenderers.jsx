import { CLOTHES } from '@/constants/clothes';
import CanvasImageLayer from '@/components/CanvasImageLayer';
import { HAIR_OPTIONS } from '@/constants/positions';

function renderClothes(selections, getLayerProps) {
  const activeIds = selections.clothes || [];
  if (activeIds.length === 0) return null;

  const renderItems = [];
  const selectedPants = activeIds.filter(id => {
    const c = CLOTHES.find(item => item.id === id);
    return c && c.category === 'pant';
  });
  const selectedSkirts = activeIds.filter(id => {
    const c = CLOTHES.find(item => item.id === id);
    return c && c.category === 'skirt';
  });
  const selectedShirts = activeIds.filter(id => {
    const c = CLOTHES.find(item => item.id === id);
    return c && c.category === 'shirt';
  });

  selectedPants.forEach(id => renderItems.push({ id }));
  selectedSkirts.forEach(id => renderItems.push({ id }));
  selectedShirts.forEach(id => renderItems.push({ id }));

  return renderItems.map(item => {
    const props = getLayerProps('clothes', item.id);
    if (!props) return null;

    const src = `/clothes/${item.id}.png`;
    return (
      <CanvasImageLayer
        key={item.id}
        src={src}
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

    const src = `/accessory/${accId}.png`;
    return (
      <CanvasImageLayer
        key={accId}
        src={src}
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
      />
    );
  });
}

function renderSingleSelect(selections, getLayerProps, category) {
  const sel = selections[category];
  if (!sel) return null;

  const props = getLayerProps(category);
  if (!props) return null;

  const src = `/${category}/${sel}.png`;

  return (
    <CanvasImageLayer
      key={category}
      src={src}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
  );
}

function renderHairTop(selections, getLayerProps) {
  const sel = selections.hair;
  if (!sel) return null;

  const props = getLayerProps('hair', sel);
  if (!props) return null;

  const src = `/hair-top/${sel}.png`;

  return (
    <CanvasImageLayer
      key='hair'
      src={src}
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

  const src = `/hair-bottom/${sel}.png`;

  return (
    <CanvasImageLayer
      key='hair_bottom'
      src={src}
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
  default: renderSingleSelect
};
