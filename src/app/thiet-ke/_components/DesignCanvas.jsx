import { memo, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import useImage from 'use-image';
import { useLayerProps } from '@/app/thiet-ke/_hooks/useLayerProps';
import { renderLayers } from '@/components/LayerRenderers';
import { useParts } from '@/app/thiet-ke/_hooks/usePartsData';

const DesignCanvas = memo(forwardRef(function DesignCanvas({ width, height, selections, partOptions }, ref) {
  const stageRef = useRef(null);
  const backgroundRef = useRef(null);

  const { data: parts } = useParts();

  const bodyOptionId = selections.selections[1];
  const bodyOptions = partOptions[1] || [];
  const bodyOption = bodyOptions.find(o => o.id === bodyOptionId);
  const [bodyImage] = useImage(bodyOption?.imageUrl || null, "anonymous");

  const getLayerProps = useLayerProps(width, height, bodyImage);

  useImperativeHandle(ref, () => ({
    getCharacterDataUrl() {
      if (!stageRef.current) return null;
      const stage = stageRef.current;

      backgroundRef.current?.visible(false);
      stage.draw();

      const layer = stage.findOne("Layer");
      let cropRect = null;

      layer?.children?.forEach((child) => {
        if (child === backgroundRef.current) return;
        const rect = child.getClientRect();
        if (!cropRect) {
          cropRect = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        } else {
          const x2 = Math.max(cropRect.x + cropRect.width, rect.x + rect.width);
          const y2 = Math.max(cropRect.y + cropRect.height, rect.y + rect.height);
          cropRect.x = Math.min(cropRect.x, rect.x);
          cropRect.y = Math.min(cropRect.y, rect.y);
          cropRect.width = x2 - cropRect.x;
          cropRect.height = y2 - cropRect.y;
        }
      });

      if (cropRect) {
        const padding = 20;
        cropRect.x = Math.max(0, cropRect.x - padding);
        cropRect.y = Math.max(0, cropRect.y - padding);
        cropRect.width = Math.min(stage.width() - cropRect.x, cropRect.width + padding * 2);
        cropRect.height = Math.min(stage.height() - cropRect.y, cropRect.height + padding * 2);
      }

      const dataUrl = stage.toDataURL(cropRect || undefined);

      backgroundRef.current?.visible(true);
      stage.draw();

      return dataUrl;
    }
  }));

  const canvasColors = useMemo(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      from: s.getPropertyValue('--canvas-from').trim(),
      to: s.getPropertyValue('--canvas-to').trim(),
    };
  }, []);

  const layers = useMemo(
    () => renderLayers(selections, getLayerProps, parts, partOptions),
    [selections, getLayerProps, parts, partOptions]
  );

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
          fillLinearGradientEndPoint={{ x: width, y: height }}
          fillLinearGradientColorStops={[0, canvasColors.from, 1, canvasColors.to]}
        />
        {layers}
      </Layer>
    </Stage>
  );
}));

export default DesignCanvas;
