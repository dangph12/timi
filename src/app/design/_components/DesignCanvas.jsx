import { useAtomValue } from 'jotai';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { designSelectionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Image as KonvaImage, Group } from 'react-konva';
import useImage from '../_hooks/useImage';
import {
  LAYER_ORDER,
  POSITION_OFFSETS
} from '@/constants/positions';
import { CLOTHES_OFFSETS } from '@/constants/clothes';
import { ACCESSORY_OFFSETS } from '@/constants/accessory';
import { HAIR_OFFSETS, HAIR_BOTTOM_OFFSETS } from '@/constants/hair';
import { LAYER_RENDERERS } from '@/components/LayerRenderers.jsx';

const ELEMENT_OFFSETS = {
  accessory: ACCESSORY_OFFSETS,
  clothes: CLOTHES_OFFSETS,
  hair: HAIR_OFFSETS,
  hair_bottom: HAIR_BOTTOM_OFFSETS,
};

function calcVersionBounds(canvasWidth, canvasHeight, versionImage) {
  const maxDim = Math.min(canvasWidth, canvasHeight) * 0.7;
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

const DesignCanvas = forwardRef(function DesignCanvas({ width, height }, ref) {
  const selections = useAtomValue(designSelectionsAtom);

  const stageRef = useRef(null);
  const backgroundRef = useRef(null);
  const categoryRefs = useRef({});

  useImperativeHandle(ref, () => ({
    getCharacterDataUrl() {
      if (!stageRef.current) return null;

      // Hide non-character components
      if (backgroundRef.current) backgroundRef.current.visible(false);

      const itemGroup = categoryRefs.current['item'];
      const packagingGroup = categoryRefs.current['packaging'];

      if (itemGroup) itemGroup.visible(false);
      if (packagingGroup) packagingGroup.visible(false);

      // Redraw canvas synchronously to apply visibility changes before capture
      stageRef.current.draw();

      // Export transparent base64 image
      const dataUrl = stageRef.current.toDataURL();

      // Restore visibility
      if (backgroundRef.current) backgroundRef.current.visible(true);
      if (itemGroup) itemGroup.visible(true);
      if (packagingGroup) packagingGroup.visible(true);

      // Redraw canvas with full visuals active
      stageRef.current.draw();

      return dataUrl;
    }
  }));

  const versionSrc = selections.version
    ? `/version/${selections.version}.png`
    : null;
  const versionImage = useImage(versionSrc);

  const versionBounds = calcVersionBounds(width, height, versionImage);

  function getLayerProps(category, elementId = null) {
    const version = selections.version || 'standard';
    const baseCategory = category === 'hair_bottom' ? 'hair_bottom' : category;

    const fallbackOffsets = POSITION_OFFSETS[version] || POSITION_OFFSETS.standard;

    const specificOffsets = ELEMENT_OFFSETS[baseCategory];
    const versionOffsets = specificOffsets?.[version] ?? specificOffsets?.standard;
    const offset = elementId && versionOffsets
      ? (versionOffsets[elementId] ?? fallbackOffsets[baseCategory])
      : fallbackOffsets[baseCategory];

    if (!offset) return null;

    const layerX = versionBounds.x + versionBounds.width * offset.x;
    const layerY = versionBounds.y + versionBounds.height * offset.y;
    const layerW = versionBounds.width * offset.scale;
    const layerH = versionBounds.height * offset.scale;

    return { x: layerX, y: layerY, width: layerW, height: layerH };
  }

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

        {LAYER_ORDER.map(category => {
          if (category === 'version') {
            return (
              versionImage && (
                <KonvaImage
                  key='version'
                  image={versionImage}
                  x={versionBounds.x - versionBounds.width / 2}
                  y={versionBounds.y - versionBounds.height / 2}
                  width={versionBounds.width}
                  height={versionBounds.height}
                />
              )
            );
          }

          const renderer = LAYER_RENDERERS[category] || LAYER_RENDERERS.default;
          const content = renderer(selections, getLayerProps, category);
          if (!content) return null;
          return (
            <Group
              key={category}
              ref={node => {
                if (node) {
                  categoryRefs.current[category] = node;
                } else {
                  delete categoryRefs.current[category];
                }
              }}
            >
              {content}
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
});

export default DesignCanvas;
