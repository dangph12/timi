import { useAtomValue } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from '../_hooks/useImage';

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
  clothes: { x: 0, y: 0.55, scale: 1 },
  hair: { x: 0, y: -0.1, scale: 0.6 },
  eyes: { x: 0.35, y: 0.25, scale: 0.3 },
  lip: { x: 0.35, y: 0.4, scale: 0.25 },
  accessory: { x: 0.65, y: 0.3, scale: 0.35 },
  item: { x: 0.8, y: 0.6, scale: 0.4 },
  packaging: { x: 0, y: 0, scale: 1.1 }
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

  function getLayerProps(category) {
    const offset = POSITION_OFFSETS[category];
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

        {LAYER_ORDER.filter((c) => c !== 'version').map((category) => {
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
