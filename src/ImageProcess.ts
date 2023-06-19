// ImageID.ts

import path from 'path';

interface Image {
  id: string;
  path: string;
}

const images: Image[] = [
  { id: '1', path: '/path/to/image1.jpg' },
  { id: '2', path: '/path/to/image2.jpg' },
  // Add more images as needed
];

export function getImageById(id: string): string | undefined {
  const image = images.find((img) => img.id === id);
  return image ? image.path : undefined;
}

const scaleDir = path.join(__dirname, 'scaled');

export function getScaleImagePath(
  id: string,
  width: string | undefined,
  height: string | undefined
): string {
  const dimensions = `${width}x${height}`;
  const fileName = `${id}_${dimensions}.jpg`;
  return path.join(scaleDir, fileName);
}
