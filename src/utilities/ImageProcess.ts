// ImageID.ts

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

interface Image {
    id: string;
    path: string;
}

const images: Image[] = [];

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

export function loadImage() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const image = {
                width: 800,
                height: 600,
                format: 'jpg'
            };

            resolve(image);
        }, 1000);
    });
}
export function processImage(
    id: string,
    width: string,
    height: string,
    fullFolderPath: string,
    thumbFolderPath: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const originalImageName = fs
            .readdirSync(fullFolderPath)
            .find((file) => file.startsWith(id));

        if (!originalImageName) {
            reject(`Original image not found for ID ${id}`);
            return;
        }

        const originalImagePath = path.join(fullFolderPath, originalImageName);
        const scaledImageFilename = `${id}_${width}x${height}.jpg`;
        const scaledImagePath = path.join(thumbFolderPath, scaledImageFilename);

        if (fs.existsSync(scaledImagePath)) {
            resolve(scaledImagePath);
            return;
        }

        // Validate the width and height parameters
        if (!width || !height || isNaN(+width) || isNaN(+height)) {
            reject('Invalid width or height parameter');
            return;
        }

        sharp(originalImagePath)
            .resize(+width, +height)
            .toFile(scaledImagePath, (error) => {
                if (error) {
                    reject(`Error resizing and saving image: ${error}`);
                    return;
                }

                resolve(scaledImagePath);
            });
    });
}
