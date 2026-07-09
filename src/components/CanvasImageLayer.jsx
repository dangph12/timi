import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

export default function CanvasImageLayer({
  src,
  x,
  y,
  width,
  height,
  rotation = 0
}) {
  const [image] = useImage(src, "anonymous");
  if (!image) return null;

  const scale = Math.min(width / image.width, height / image.height);
  const renderWidth = image.width * scale;
  const renderHeight = image.height * scale;

  return (
    <KonvaImage
      image={image}
      x={x - renderWidth / 2}
      y={y - renderHeight / 2}
      width={renderWidth}
      height={renderHeight}
      rotation={rotation}
    />
  );
}
