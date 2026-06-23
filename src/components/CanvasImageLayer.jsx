import { Image as KonvaImage } from 'react-konva';
import useImage from '@/app/design/_hooks/useImage';

export default function CanvasImageLayer({ src, x, y, width, height }) {
  const image = useImage(src);
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
    />
  );
}
