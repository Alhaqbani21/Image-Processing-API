import { loadImage } from '../utilities/ImageProcess';

describe('Image Processing API - Resize Image', () => {
    it('should resize the image to the specified dimensions', async () => {
        const width = 300;
        const height = 200;

        const resizedImagePromise = loadImage().then(
            (resizedImage: unknown) => {
                const image = resizedImage as { width: number; height: number };
                expect(image.width).toEqual(width);
                expect(image.height).toEqual(height);
            }
        );

        await resizedImagePromise;
        expect().nothing();
    });
});
