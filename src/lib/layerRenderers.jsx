import { CLOTHES } from '@/constants/clothes';
import CanvasImageLayer from '@/components/CanvasImageLayer';

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

  const baseAccs = activeAccs.filter(
    accId => accId !== 'A03' && accId !== 'A04'
  );

  return baseAccs.map(accId => {
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

function renderAccessoryTop(selections, getLayerProps) {
  const activeAccs = selections.accessory || [];
  if (activeAccs.length === 0) return null;

  const topAccs = activeAccs.filter(
    accId => accId === 'A03' || accId === 'A04'
  );

  return topAccs.map(accId => {
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

export const LAYER_RENDERERS = {
  clothes: renderClothes,
  accessory: renderAccessory,
  accessory_top: renderAccessoryTop,
  default: renderSingleSelect
};
