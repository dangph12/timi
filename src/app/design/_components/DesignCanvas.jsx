import { useAtomValue } from 'jotai';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { designSelectionsAtom, partOptionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Group } from 'react-konva';
import useImage from 'use-image';
import { useLayerProps } from '@/app/design/_hooks/useLayerProps';
import { renderLayers } from '@/components/LayerRenderers';
import { useParts } from '@/app/design/_hooks/usePartsData';

const DesignCanvas = forwardRef(function DesignCanvas({ width, height }, ref) {
  const selections = useAtomValue(designSelectionsAtom);
  const partOptions = useAtomValue(partOptionsAtom);
  const stageRef = useRef(null);
  const backgroundRef = useRef(null);

  const { data: parts } = useParts();

  const bodyOptionId = selections.selections[1];
  const bodyOptions = partOptions[1] || [];
  const bodyOption = bodyOptions.find(o => o.id === bodyOptionId);
  const [bodyImage] = useImage(bodyOption?.imageUrl || null);

  const getLayerProps = useLayerProps(width, height, bodyImage);

  useImperativeHandle(ref, () => ({
    getCharacterDataUrl() {
      if (!stageRef.current) return null;
      backgroundRef.current?.visible(false);
      stageRef.current.draw();
      const dataUrl = stageRef.current.toDataURL();
      backgroundRef.current?.visible(true);
      stageRef.current.draw();
      return dataUrl;
    }
  }));

  const layers = renderLayers(selections, getLayerProps, parts, partOptions);

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
        {layers.map((element, i) => (
          <Group key={i}>
            {element}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
});

export default DesignCanvas;
