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

      const props = getLayerProps(part.id, partOptions, optionId);
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
