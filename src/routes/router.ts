import express from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getFileNames } from '../utilities/nameImages';
import { isNumeric } from '../utilities/NumericChecker';

const router = express.Router();

router.get(
    '/placeholder',
    (req: express.Request, res: express.Response): void => {
        const { width, height, style } = req.query;

        const image = sharp({
            create: {
                width: parseInt(width as string, 10) || 300,
                height: parseInt(height as string, 10) || 150,
                channels: 3,
                background: style ? `#${style}` : '#f0f0f0'
            }
        });

        image
            .toBuffer()
            .then((buffer: Buffer) => {
                res.set('Content-Type', 'image/jpeg');
                res.send(buffer);
            })
            .catch((error: Error) => {
                console.error('Error generating placeholder image:', error);
                res.status(500).send('Internal Server Error');
            });
    }
);

router.get(
    '/image/:id',
    (req: express.Request, res: express.Response): void => {
        const { id } = req.params;
        const width = req.query.width as string;
        const height = req.query.height as string;

        const fullFolderPath = path.join(__dirname, '../assets/full');
        const thumbFolderPath = path.join(__dirname, '../assets/thumb');

        if (!fs.existsSync(fullFolderPath)) {
            console.error(`Full folder not found at ${fullFolderPath}`);
            res.status(500).send('Internal Server Error');
            return;
        }

        const originalImageName = fs
            .readdirSync(fullFolderPath)
            .find((file) => {
                return file.startsWith(id);
            });

        if (!originalImageName) {
            console.error(`Original image not found for ID ${id}`);
            res.status(404).send('Image not found');
            return;
        }

        const originalImagePath = path.join(fullFolderPath, originalImageName);
        const scaledImageFilename = `${id}_${width}x${height}.jpg`;
        const scaledImagePath = path.join(thumbFolderPath, scaledImageFilename);

        if (fs.existsSync(scaledImagePath)) {
            return res.sendFile(scaledImagePath);
        }

        // Validate the width and height parameters
        if (!width || !height || !isNumeric(width) || !isNumeric(height)) {
            console.error(`Invalid width or height parameter`);
            res.status(400).send('Invalid width or height parameter');
            return;
        }

        sharp(originalImagePath)
            .resize(parseInt(width), parseInt(height))
            .toFile(scaledImagePath, (error: Error) => {
                if (error) {
                    console.error('Error resizing and saving image:', error);
                    return res.status(500).send('Internal Server Error');
                }

                res.sendFile(scaledImagePath);
            });
    }
);

router.get('/', (req, res) => {
    const fileNames = getFileNames();

    const options = fileNames.map((fileName) => {
        return `<option value="${fileName}">${fileName}</option>`;
    });

    const html = `<div
    style="
      margin: 0 auto;
      border: solid 3px red;
      border-radius: 3%;
      width: 50vw;
      height: 50vh;
      display: flex;
      flex-direction: column;
      padding: 10%;
    "
  >
    <label for="images">Choose an Image ID</label>
    <select name="images" id="images">
      ${options.join('\n')}
    </select>
    <input type="number" id="widthInput" placeholder="width" />
    <input type="number" id="heightInput" placeholder="height" />
    <button type="button" onclick="processImage()">Process</button>
  </div>
  <script>
    function processImage() {
      const imageId = document.getElementById('images').value;
      const width = document.getElementById('widthInput').value;
      const height = document.getElementById('heightInput').value;
      const url = '/image/' + imageId + '?width=' + width + '&height=' + height;

      // Redirect to the /image/:id route
      window.location.href = url;
    }
  </script>`;

    res.send(html);
});

export default router;
