import { useMemo } from 'react';
import { POSITION_OFFSETS } from '@/constants/positions';
import { CLOTHES_OFFSETS } from '@/constants/clothes';
import { ACCESSORY_OFFSETS, ACCESSORIES } from '@/constants/accessory';
import {
  HAIR_OFFSETS,
  HAIR_BOTTOM_OFFSETS,
  HAIR_OPTIONS,
} from '@/constants/hair';

const ELEMENT_OFFSETS = {
  accessory: ACCESSORY_OFFSETS,
  clothes: CLOTHES_OFFSETS,
  hair: HAIR_OFFSETS,
  hair_bottom: HAIR_BOTTOM_OFFSETS,
};

const HAT_HAIR_WIDTH_MARGIN = 1.06;

const HAIR_HAT_Y_TWEAKS = {
  H02_A06: -0.05,
};

const HAIR_IMAGE_DIMS = {
  H01: { iw: 2069, ih: 1773 },
  H02: { iw: 1965, ih: 1815 },
  H03: { iw: 1887, ih: 2521 },
  H04: { iw: 2095, ih: 2130 },
  H05: { iw: 2252, ih: 2172 },
  H06: { iw: 3240, ih: 2280 },
  H07: { iw: 2395, ih: 2040 },
  H08: { iw: 3070, ih: 2005 },
};

function effectiveLayerScale(scale, imageDims, boundsAR) {
  if (!imageDims) return scale;
  const imageAR = imageDims.iw / imageDims.ih;
  return imageAR < boundsAR ? scale * (imageAR / boundsAR) : scale;
}

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
    y: canvasHeight * 0.45, // responsive: equals height/2-35 at ~700px but avoids top-clip on small screens
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
      let yOffset = offset.y;

      if (
        category === 'accessory' &&
        ACCESSORIES.find((a) => a.id === elementId)?.type === 'hat' &&
        selectedHair
      ) {
        const hairOpt = HAIR_OPTIONS.find((h) => h.id === selectedHair);
        const useBottom = hairOpt?.hasBottom ?? false;

        const hairOffsets = useBottom
          ? (HAIR_BOTTOM_OFFSETS[version] ?? HAIR_BOTTOM_OFFSETS.standard)
          : (HAIR_OFFSETS[version] ?? HAIR_OFFSETS.standard);

        const hairOffset = hairOffsets[selectedHair];

        const refOffsets =
          HAIR_BOTTOM_OFFSETS[version] ?? HAIR_BOTTOM_OFFSETS.standard;
        const refOffset = refOffsets['H01'];

        if (hairOffset?.scale && refOffset?.scale) {
          const boundsAR = versionBounds.width / versionBounds.height;
          const hairScale = effectiveLayerScale(
            hairOffset.scale,
            HAIR_IMAGE_DIMS[selectedHair],
            boundsAR,
          );
          const refScale = effectiveLayerScale(
            refOffset.scale,
            HAIR_IMAGE_DIMS['H01'],
            boundsAR,
          );
          scale = offset.scale * (hairScale / refScale) * HAT_HAIR_WIDTH_MARGIN;
        }

        const key = selectedHair + '_' + elementId;
        yOffset += HAIR_HAT_Y_TWEAKS[key] ?? 0;
      }

      return {
        x: versionBounds.x + versionBounds.width * offset.x,
        y: versionBounds.y + versionBounds.height * yOffset,
        width: versionBounds.width * scale,
        height: versionBounds.height * scale,
        rotation: offset.rotation || 0,
      };
    }

    return getLayerProps;
  }, [selectedVersion, selectedHair, versionBounds]);
}
