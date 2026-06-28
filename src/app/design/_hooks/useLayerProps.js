import { useMemo } from 'react';
import { POSITION_OFFSETS } from '@/constants/positions';
import { CLOTHES_OFFSETS } from '@/constants/clothes';
import { ACCESSORY_OFFSETS } from '@/constants/accessory';
import { HAIR_OFFSETS, HAIR_BOTTOM_OFFSETS, HAIR_OPTIONS } from '@/constants/hair';

const ELEMENT_OFFSETS = {
  accessory: ACCESSORY_OFFSETS,
  clothes: CLOTHES_OFFSETS,
  hair: HAIR_OFFSETS,
  hair_bottom: HAIR_BOTTOM_OFFSETS,
};

function calcVersionBounds(canvasWidth, canvasHeight, versionImage) {
  const maxDim = Math.min(canvasWidth, canvasHeight) * 0.55;
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
    y: canvasHeight / 2 - 35,
    width: w,
    height: h,
  };
}

export function useLayerProps(selections, width, height, versionImage) {
  const versionBounds = useMemo(
    () => calcVersionBounds(width, height, versionImage),
    [width, height, versionImage],
  );

  const selectedVersion = selections.version;
  const selectedHair = selections.hair;

  return useMemo(() => {
    function getLayerProps(category, elementId = null) {
      const version = selectedVersion || 'standard';
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

      let scale = offset.scale;

      if (
        category === 'accessory' &&
        (elementId === 'A05' || elementId === 'A06') &&
        selectedHair
      ) {
        const hairOpt = HAIR_OPTIONS.find(h => h.id === selectedHair);
        const useBottom = hairOpt?.hasBottom ?? false;

        const hairOffsets = useBottom
          ? (HAIR_BOTTOM_OFFSETS[version] ?? HAIR_BOTTOM_OFFSETS.standard)
          : (HAIR_OFFSETS[version] ?? HAIR_OFFSETS.standard);

        const hairOffset = hairOffsets[selectedHair];

        const refOffsets =
          HAIR_BOTTOM_OFFSETS[version] ?? HAIR_BOTTOM_OFFSETS.standard;
        const refOffset = refOffsets['H01'];

        if (hairOffset?.scale && refOffset?.scale) {
          const hairSize = versionBounds.width * hairOffset.scale;
          const refSize = versionBounds.width * refOffset.scale;
          scale = offset.scale * (hairSize / refSize) + 0.1;
        }
      }

      return {
        x: versionBounds.x + versionBounds.width * offset.x,
        y: versionBounds.y + versionBounds.height * offset.y,
        width: versionBounds.width * scale,
        height: versionBounds.height * scale,
        rotation: offset.rotation || 0,
      };
    }

    return getLayerProps;
  }, [selectedVersion, selectedHair, versionBounds]);
}
