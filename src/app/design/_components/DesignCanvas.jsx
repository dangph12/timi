import { useAtomValue } from 'jotai';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { designSelectionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { LAYER_ORDER } from '@/constants/positions';
import useImage from 'use-image';
import { useLayerProps } from '@/app/design/_hooks/useLayerProps';
import { renderLayer } from '@/components/LayerRenderers';

const DesignCanvas = forwardRef(function DesignCanvas({ width, height }, ref) {
  const selections = useAtomValue(designSelectionsAtom);
  const stageRef = useRef(null);
  const backgroundRef = useRef(null);
  const categoryRefs = useRef({});

  const versionSrc = selections.version
    ? `/version/${selections.version}.png`
    : null;
  const [versionImage] = useImage(versionSrc);

  const getLayerProps = useLayerProps(selections, width, height, versionImage);

  useImperativeHandle(ref, () => ({
    getCharacterDataUrl() {
      if (!stageRef.current) return null;

      backgroundRef.current?.visible(false);
      const itemGroup = categoryRefs.current['item'];
      const packagingGroup = categoryRefs.current['packaging'];
      itemGroup?.visible(false);
      packagingGroup?.visible(false);
      stageRef.current.draw();

      const dataUrl = stageRef.current.toDataURL();

      backgroundRef.current?.visible(true);
      itemGroup?.visible(true);
      packagingGroup?.visible(true);
      stageRef.current.draw();

      return dataUrl;
    }
  }));

  const refFor = category => node => {
    if (node) categoryRefs.current[category] = node;
    else delete categoryRefs.current[category];
  };

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
          const content = renderLayer(selections, getLayerProps, category);
          return (
            content && (
              <Group key={category} ref={refFor(category)}>
                {content}
              </Group>
            )
          );
        })}
      </Layer>
    </Stage>
  );
});

export default DesignCanvas;
