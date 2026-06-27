import { useMemo } from 'react';
import { POSITION_OFFSETS } from '@/constants/positions';
import { CLOTHES_OFFSETS } from '@/constants/clothes';
import { ACCESSORY_OFFSETS } from '@/constants/accessory';
import { HAIR_OFFSETS, HAIR_BOTTOM_OFFSETS } from '@/constants/hair';

const ELEMENT_OFFSETS = {
  accessory: ACCESSORY_OFFSETS,
  clothes: CLOTHES_OFFSETS,
  hair: HAIR_OFFSETS,
  hair_bottom: HAIR_BOTTOM_OFFSETS,
};

function calcVersionBounds(canvasWidth, canvasHeight, versionImage) {
  const maxDim = Math.min(canvasWidth, canvasHeight) * 0.7;
  let w = maxDim;
  let h = maxDim;

  if (versionImage?.width && versionImage?.height) {
    const ratio = versionImage.width / versionImage.height;
    if (ratio > 1) {
      h = maxDim / ratio;
    } else {
      w = maxDim * ratio;
    }
  }

  return {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    width: w,
    height: h,
  };
}

export function useLayerProps(selections, width, height, versionImage) {
  const versionBounds = useMemo(
    () => calcVersionBounds(width, height, versionImage),
    [width, height, versionImage]
  );

  return useMemo(() => {
    function getLayerProps(category, elementId = null) {
      const version = selections.version || 'standard';
      const fallbackOffsets =
        POSITION_OFFSETS[version] || POSITION_OFFSETS.standard;

      const specificOffsets = ELEMENT_OFFSETS[category];
      const versionOffsets =
        specificOffsets?.[version] ?? specificOffsets?.standard;
      const offset =
        elementId && versionOffsets
          ? (versionOffsets[elementId] ?? fallbackOffsets[category])
          : fallbackOffsets[category];

      if (!offset) return null;

      return {
        x: versionBounds.x + versionBounds.width * offset.x,
        y: versionBounds.y + versionBounds.height * offset.y,
        width: versionBounds.width * offset.scale,
        height: versionBounds.height * offset.scale,
        rotation: offset.rotation || 0,
      };
    }

    return getLayerProps;
  }, [selections.version, versionBounds]);
}
