import { Image as KonvaImage } from 'react-konva';
import useImage from '@/app/design/_hooks/useImage';

export default function CanvasImageLayer({ src, x, y, width, height }) {
  const image = useImage(src);
  if (!image) return null;

  const imageRatio = image.width / image.height;
  let renderWidth = width;
  let renderHeight = height;

  if (imageRatio > 1) {
    renderHeight = width / imageRatio;
  } else {
    renderWidth = height * imageRatio;
  }

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
