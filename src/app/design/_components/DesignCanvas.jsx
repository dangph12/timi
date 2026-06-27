import { useAtomValue } from 'jotai';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { designSelectionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import { LAYER_ORDER } from '@/constants/positions';
import useImage from 'use-image';
import { useLayerProps } from '@/app/design/_hooks/useLayerProps';
import { renderLayer } from '@/components/LayerRenderers';
import CanvasImageLayer from '@/components/CanvasImageLayer';

const DesignCanvas = forwardRef(function DesignCanvas({ width, height }, ref) {
  const selections = useAtomValue(designSelectionsAtom);
  const stageRef = useRef(null);
  const backgroundRef = useRef(null);
  const categoryRefs = useRef({});
  const itemPreviewRef = useRef(null);

  const versionSrc = selections.version
    ? `/version/${selections.version}.png`
    : null;
  const [versionImage] = useImage(versionSrc);

  const showItemPreview = !!(selections.item?.type && selections.item?.color);
  const characterWidth = showItemPreview ? Math.round(width * 0.6) : width;
  const getLayerProps = useLayerProps(
    selections,
    characterWidth,
    height,
    versionImage
  );

  const itemVersion = selections.version || 'standard';
  const itemSrc = showItemPreview
    ? `/item/${itemVersion}/${selections.item.type}/${selections.item.color}.png`
    : null;

  useImperativeHandle(ref, () => ({
    getCharacterDataUrl() {
      if (!stageRef.current) return null;

      backgroundRef.current?.visible(false);
      const packagingGroup = categoryRefs.current['packaging'];
      packagingGroup?.visible(false);
      itemPreviewRef.current?.visible(false);
      stageRef.current.draw();

      const dataUrl = stageRef.current.toDataURL();

      backgroundRef.current?.visible(true);
      packagingGroup?.visible(true);
      itemPreviewRef.current?.visible(true);
      stageRef.current.draw();

      return dataUrl;
    }
  }));

  const refFor = category => node => {
    if (node) categoryRefs.current[category] = node;
    else delete categoryRefs.current[category];
  };

  const itemPreviewWidth = Math.round(width * 0.28);
  const itemPreviewHeight = Math.round(height * 0.55);
  const imageCenterX = Math.round(width * 0.8);
  const imageTop = Math.round(height / 2 - itemPreviewHeight / 2);
  const sampleFontSize = Math.round(itemPreviewHeight * 0.15);
  const sampleY = Math.round(imageTop - sampleFontSize * 0.1);

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
        {LAYER_ORDER.filter(cat => cat !== 'item').map(category => {
          const content = renderLayer(selections, getLayerProps, category);
          return (
            content && (
              <Group key={category} ref={refFor(category)}>
                {content}
              </Group>
            )
          );
        })}
        {showItemPreview && (
          <Group ref={itemPreviewRef}>
            <Text
              text='SAMPLE'
              x={Math.round(width * 0.66)}
              y={sampleY}
              width={itemPreviewWidth}
              fontSize={sampleFontSize}
              fontFamily='Roboto Variable'
              fontStyle='bold'
              fill='white'
              align='center'
            />
            {itemSrc && (
              <CanvasImageLayer
                src={itemSrc}
                x={imageCenterX}
                y={height / 2}
                width={itemPreviewWidth}
                height={itemPreviewHeight}
              />
            )}
          </Group>
        )}
      </Layer>
    </Stage>
  );
});

export default DesignCanvas;
