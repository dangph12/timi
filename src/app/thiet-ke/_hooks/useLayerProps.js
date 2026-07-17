import { useMemo } from 'react';

function calcBodyBounds(canvasWidth, canvasHeight, bodyImage) {
  const maxDim = Math.min(canvasWidth, canvasHeight) * 0.55;
  let w = maxDim;
  let h = maxDim;

  if (bodyImage?.width && bodyImage?.height) {
    const ratio = bodyImage.width / bodyImage.height;
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

export function useLayerProps(width, height, bodyImage) {
  const bodyBounds = useMemo(
    () => calcBodyBounds(width, height, bodyImage),
    [width, height, bodyImage]
  );

  return useMemo(() => {
    function getLayerProps(partId, partOptions, optionId) {
      const optionsArr = partOptions?.[partId];
      if (!optionsArr || optionsArr.length === 0) return null;

      const option = optionId
        ? optionsArr.find(o => o.id === optionId)
        : optionsArr[0];
      if (!option) return null;

      return {
        x: bodyBounds.x + bodyBounds.width * (option.deltaX || 0),
        y: bodyBounds.y + bodyBounds.height * (option.deltaY || 0),
        width: bodyBounds.width * (option.deltaScale || 1),
        height: bodyBounds.height * (option.deltaScale || 1),
        rotation: option.rotation || 0,
      };
    }

    return getLayerProps;
  }, [bodyBounds]);
}
