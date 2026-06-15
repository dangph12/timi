import { useAtomValue } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from '../_hooks/useImage';
import {
  LAYER_ORDER,
  POSITION_OFFSETS,
  CLOTHES_OFFSETS,
  ACCESSORY_OFFSETS
} from '@/constants/positions';
import { LAYER_RENDERERS } from '@/lib/layerRenderers.jsx';

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
    } else if (category === 'clothes' && elementId) {
      const clVersionOffsets =
        CLOTHES_OFFSETS[version] || CLOTHES_OFFSETS.standard;
      offset =
        clVersionOffsets[elementId] ||
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
          const renderer = LAYER_RENDERERS[category] || LAYER_RENDERERS.default;
          return renderer(selections, getLayerProps, category);
        })}
      </Layer>
    </Stage>
  );
}
