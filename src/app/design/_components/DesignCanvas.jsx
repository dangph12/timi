import { useAtomValue } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from '../_hooks/useImage';
import { CLOTHES } from '@/constants/clothes';

const LAYER_ORDER = [
  'packaging',
  'version',
  'clothes',
  'hair',
  'eyes',
  'lip',
  'accessory',
  'item'
];

const POSITION_OFFSETS = {
  standard: {
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.1, scale: 0.6 },
    eyes: { x: 0, y: -0.16, scale: 0.55 },
    lip: { x: 0, y: -0.05, scale: 0.15 },
    accessory: { x: 0.65, y: 0.3, scale: 0.35 },
    item: { x: 0.8, y: 0.6, scale: 0.4 },
    packaging: { x: 0, y: 0, scale: 1.1 }
  },
  economy: {
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.1, scale: 0.6 },
    eyes: { x: 0, y: 0.1, scale: 0.65 },
    lip: { x: 0, y: 0.35, scale: 0.18 },
    accessory: { x: 0.65, y: 0.3, scale: 0.35 },
    item: { x: 0.8, y: 0.6, scale: 0.4 },
    packaging: { x: 0, y: 0, scale: 1.1 }
  }
};

const ACCESSORY_OFFSETS = {
  standard: {
    A01: { x: 0.65, y: 0.3, scale: 0.35 },
    A02: { x: 0.65, y: 0.3, scale: 0.35 },
    A03: { x: 0.65, y: 0.3, scale: 0.35 },
    A04: { x: 0.65, y: 0.3, scale: 0.35 },
    A05: { x: 0.65, y: 0.3, scale: 0.35 },
    A06: { x: 0.65, y: 0.3, scale: 0.35 },
    A07: { x: 0.65, y: 0.3, scale: 0.35 },
    A08: { x: 0.65, y: 0.3, scale: 0.35 }
  },
  economy: {
    A01: { x: 0.65, y: 0.3, scale: 0.35 },
    A02: { x: 0.65, y: 0.3, scale: 0.35 },
    A03: { x: 0.65, y: 0.3, scale: 0.35 },
    A04: { x: 0.65, y: 0.3, scale: 0.35 },
    A05: { x: 0.65, y: 0.3, scale: 0.35 },
    A06: { x: 0.65, y: 0.3, scale: 0.35 },
    A07: { x: 0.65, y: 0.3, scale: 0.35 },
    A08: { x: 0.65, y: 0.3, scale: 0.35 }
  }
};

function ImageLayer({ src, x, y, width, height }) {
  const image = useImage(src);
  if (!image) return null;

  const imageRatio = image.width / image.height;
  let renderWidth = width;
  let renderHeight = height;

  if (imageRatio > 1) {
    renderHeight = width / imageRatio;
  } else {
    renderWidth = height * imageRatio;
  }

  return (
    <KonvaImage
      image={image}
      x={x - renderWidth / 2}
      y={y - renderHeight / 2}
      width={renderWidth}
      height={renderHeight}
    />
  );
}

function calcVersionBounds(canvasWidth, canvasHeight, versionImage) {
  const maxDim = Math.min(canvasWidth, canvasHeight) * 0.83;
  let renderWidth = maxDim;
  let renderHeight = maxDim;

  if (versionImage && versionImage.width && versionImage.height) {
    const ratio = versionImage.width / versionImage.height;
    if (ratio > 1) {
      renderHeight = maxDim / ratio;
    } else {
      renderWidth = maxDim * ratio;
    }
  }

  return {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    width: renderWidth,
    height: renderHeight
  };
}

export default function DesignCanvas({ width, height }) {
  const selections = useAtomValue(designSelectionsAtom);

  const versionSrc = selections.version
    ? `/version/${selections.version}.png`
    : null;
  const versionImage = useImage(versionSrc);

  const versionBounds = calcVersionBounds(width, height, versionImage);

  function getLayerProps(category, elementId = null) {
    const version = selections.version || 'standard';
    let offset;

    if (category === 'accessory' && elementId) {
      const accVersionOffsets =
        ACCESSORY_OFFSETS[version] || ACCESSORY_OFFSETS.standard;
      offset =
        accVersionOffsets[elementId] ||
        (POSITION_OFFSETS[version] || POSITION_OFFSETS.standard)[category];
    } else {
      const offsets = POSITION_OFFSETS[version] || POSITION_OFFSETS.standard;
      offset = offsets[category];
    }

    if (!offset) return null;

    const layerX = versionBounds.x + versionBounds.width * offset.x;
    const layerY = versionBounds.y + versionBounds.height * offset.y;
    const layerW = versionBounds.width * offset.scale;
    const layerH = versionBounds.height * offset.scale;

    return { x: layerX, y: layerY, width: layerW, height: layerH };
  }

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: height }}
          fillLinearGradientColorStops={[0, '#0000FF', 1, '#4A4AFF']}
        />

        {versionImage && (
          <KonvaImage
            image={versionImage}
            x={versionBounds.x - versionBounds.width / 2}
            y={versionBounds.y - versionBounds.height / 2}
            width={versionBounds.width}
            height={versionBounds.height}
          />
        )}

        {LAYER_ORDER.filter(c => c !== 'version').map(category => {
          if (category === 'clothes') {
            const activeIds = selections.clothes || [];
            if (activeIds.length === 0) return null;

            // Layer ordering: pants/skirts render first, then shirt on top
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

            const props = getLayerProps('clothes');
            if (!props) return null;

            return renderItems.map(item => {
              const src = `/clothes/${item.id}.png`;
              return (
                <ImageLayer
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
          if (category === 'accessory') {
            const activeAccs = selections.accessory || [];
            if (activeAccs.length === 0) return null;

            return activeAccs.map(accId => {
              const props = getLayerProps('accessory', accId);
              if (!props) return null;

              const src = `/accessory/${accId}.png`;
              return (
                <ImageLayer
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

          const sel = selections[category];
          if (!sel) return null;

          const props = getLayerProps(category);
          if (!props) return null;

          const src = `/${category}/${sel}.png`;

          return (
            <ImageLayer
              key={category}
              src={src}
              x={props.x}
              y={props.y}
              width={props.width}
              height={props.height}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}
