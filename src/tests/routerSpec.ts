import request from 'supertest';
import app from '../index';

describe('GET /image/:id', () => {
    it('should return the scaled image file if it exists', async () => {
        const response = await request(app).get(
            '/image/1?width=200&height=200'
        );
        expect(response.status).toBe(200);
        expect(response.type).toBe('image/jpeg');
    });

    it('should return 404 if the original image is not found', async () => {
        const response = await request(app).get(
            '/image/nonexistentid?width=200&height=200'
        );
        expect(response.status).toBe(404);
        expect(response.text).toBe('Image not found');
    });

    it('should return 400 if width or height parameter is missing or invalid', async () => {
        const response = await request(app).get(
            '/image/1?width=abc&height=200'
        );
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid width or height parameter');
    });

    it('should return 404 if there the image is not found', async () => {
        // Simulate an error by providing an invalid image ID
        const response = await request(app).get(
            '/image/invalidID?width=200&height=200'
        );
        expect(response.status).toBe(404);
        expect(response.text).toBe('Image not found');
    });
});
