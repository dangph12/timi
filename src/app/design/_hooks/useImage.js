import { useState, useEffect } from 'react';

export default function useImage(url) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!url) {
      return;
    }
    let active = true;
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      if (active) setImage(img);
    };
    img.onerror = (err) => {
      console.error('Failed to load image:', url, err);
      if (active) setImage(null);
    };
    return () => {
      active = false;
      setImage(null);
    };
  }, [url]);
  return image;
}
