import { useAtomValue } from 'jotai';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { designSelectionsAtom } from '@/store/design';
import { Stage, Layer, Rect, Group, Text, Image as KonvaImage } from 'react-konva';
import {
  LAYER_ORDER,
  PACKAGING_SCENE_ITEMS,
  CHARACTER_PACKAGING_TRANSFORM,
  ITEM_TYPE_PACKAGING_IMAGES,
  DIY_BOX_VERSION_IMAGES,
  DIY_BOX_BACKGROUND_POSITION,
  DIY_BOX_BODY_POSITION
} from '@/constants/positions';
import useImage from 'use-image';
import { useLayerProps } from '@/app/design/_hooks/useLayerProps';
import { renderLayer } from '@/components/LayerRenderers';
import CanvasImageLayer from '@/components/CanvasImageLayer';

function PackagingImage({ src, cx, cy, maxW, maxH, rotation = 0 }) {
  const [image] = useImage(src);
  if (!image) return null;
  const scale = Math.min(maxW / image.width, maxH / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  return (
    <KonvaImage
      image={image}
      x={cx}
      y={cy}
      width={w}
      height={h}
      offsetX={w / 2}
      offsetY={h / 2}
      rotation={rotation}
    />
  );
}

function PackagingScene({ width, height, items }) {
  return (
    <>
      {items.map(item => (
        <PackagingImage
          key={item.src}
          src={item.src}
          cx={width * item.cxRatio}
          cy={height * item.cyRatio}
          maxW={width * item.maxWRatio}
          maxH={height * item.maxHRatio}
          rotation={item.rotation ?? 0}
        />
      ))}
    </>
  );
}

const ITEM_STEP = 7;
const PACKAGING_STEP = 8;

const DesignCanvas = forwardRef(function DesignCanvas({ width, height, activeStep }, ref) {
  const selections = useAtomValue(designSelectionsAtom);
  const stageRef = useRef(null);
  const backgroundRef = useRef(null);
  const categoryRefs = useRef({});
  const itemPreviewRef = useRef(null);
  const characterGroupRef = useRef(null);

  const versionSrc = selections.version
    ? `/version/${selections.version}.png`
    : null;
  const [versionImage] = useImage(versionSrc);

  const showPackaging = !!selections.packaging && activeStep === PACKAGING_STEP;
  const showItemPreview = !!(selections.item?.type && selections.item?.color) && activeStep === ITEM_STEP;

  const characterWidth = showItemPreview
    ? Math.round(width * 0.6)
    : showPackaging
      ? Math.round(width * 0.5)
      : width;

  const characterOffsetX =
    showPackaging && !showItemPreview ? Math.round(width * 0.5) : 0;

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

      const characterGroup = characterGroupRef.current;
      const prevAttrs = characterGroup
        ? {
            x: characterGroup.x(),
            y: characterGroup.y(),
            rotation: characterGroup.rotation(),
            visible: characterGroup.visible()
          }
        : null;
      if (characterGroup) {
        characterGroup.visible(true);
        characterGroup.position({
          x: characterWidth / 2,
          y: height / 2 - 35
        });
        characterGroup.rotation(0);
      }

      stageRef.current.draw();

      const dataUrl = stageRef.current.toDataURL({
        x: 0,
        y: 0,
        width: characterWidth,
        height,
        pixelRatio: 2
      });

      backgroundRef.current?.visible(true);
      packagingGroup?.visible(true);
      itemPreviewRef.current?.visible(true);
      if (characterGroup && prevAttrs) {
        characterGroup.position({ x: prevAttrs.x, y: prevAttrs.y });
        characterGroup.rotation(prevAttrs.rotation);
        characterGroup.visible(prevAttrs.visible);
      }
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

  const isDiyBox = showPackaging && selections.packaging === 'diy-box';

  const itemPackagingImage =
    ITEM_TYPE_PACKAGING_IMAGES[selections.item?.type] ?? ITEM_TYPE_PACKAGING_IMAGES.keychain;
  const applyItemPackagingImage = items =>
    items.map(item =>
      item.src === ITEM_TYPE_PACKAGING_IMAGES.keychain
        ? { ...item, src: itemPackagingImage }
        : item
    );

  const packagingSceneItems = showPackaging
    ? isDiyBox
      ? (() => {
          const versionImages =
            DIY_BOX_VERSION_IMAGES[selections.version] ?? DIY_BOX_VERSION_IMAGES.standard;
          return [
            ...applyItemPackagingImage(PACKAGING_SCENE_ITEMS['diy-box'] || []),
            { src: versionImages.background, ...DIY_BOX_BACKGROUND_POSITION },
            { src: versionImages.body, ...DIY_BOX_BODY_POSITION }
          ];
        })()
      : applyItemPackagingImage(PACKAGING_SCENE_ITEMS[selections.packaging] || [])
    : null;

  const characterPivotX = characterWidth / 2;
  const characterPivotY = height / 2 - 35;
  const characterExtraY = showPackaging
    ? height * CHARACTER_PACKAGING_TRANSFORM.yRatio
    : 0;
  const characterRotation = showPackaging
    ? CHARACTER_PACKAGING_TRANSFORM.rotation
    : 0;

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
        {packagingSceneItems?.length > 0 && (
          <Group ref={refFor('packaging')}>
            <PackagingScene width={width} height={height} items={packagingSceneItems} />
          </Group>
        )}
        <Group
          ref={characterGroupRef}
          visible={!isDiyBox}
          x={characterOffsetX + characterPivotX}
          y={characterPivotY + characterExtraY}
          offsetX={characterPivotX}
          offsetY={characterPivotY}
          rotation={characterRotation}
        >
          {LAYER_ORDER.filter(cat => cat !== 'item' && cat !== 'packaging').map(category => {
            const content = renderLayer(selections, getLayerProps, category);
            return (
              content && (
                <Group key={category} ref={refFor(category)}>
                  {content}
                </Group>
              )
            );
          })}
        </Group>
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
