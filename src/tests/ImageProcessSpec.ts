import fs from 'fs';
import path from 'path';

import { processImage } from '../utilities/ImageProcess';

describe('Image Processing', () => {
    const fullFolderPath = path.join(__dirname, '../assets/full');
    const thumbFolderPath = path.join(__dirname, '../assets/thumb');
    const id = '1';
    const width = '300';
    const height = '200';

    beforeEach(() => {
        const scaledImageFilename = `${id}_${width}x${height}.jpg`;
        const scaledImagePath = path.join(thumbFolderPath, scaledImageFilename);
        if (fs.existsSync(scaledImagePath)) {
            fs.unlinkSync(scaledImagePath);
        }
    });

    it('should generate the scaled image', async () => {
        const scaledImagePath = await processImage(
            id,
            width,
            height,
            fullFolderPath,
            thumbFolderPath
        );
        console.log(fs.existsSync(scaledImagePath));
    });
});
