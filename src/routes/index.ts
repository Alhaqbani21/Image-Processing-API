import express from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getFileNames } from '../utilities/nameImages';

const router = express.Router();

router.get('/placeholder', (req, res) => {
  const { width, height, style } = req.query;

  const image = sharp({
    create: {
      width: parseInt(width as string) || 300,
      height: parseInt(height as string) || 150,
      channels: 3,
      background: style ? `#${style}` : '#f0f0f0',
    },
  });

  image
    .toBuffer()
    .then((buffer) => {
      res.set('Content-Type', 'image/jpeg');
      res.send(buffer);
    })
    .catch((error) => {
      console.error('Error generating placeholder image:', error);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/image/:id', (req, res) => {
  const { id } = req.params;
  const { width, height } = req.query;

  const fullFolderPath = path.join(__dirname, '../assets/full');
  const thumbFolderPath = path.join(__dirname, '../assets/thumb');

  if (!fs.existsSync(fullFolderPath)) {
    console.error(`Full folder not found at ${fullFolderPath}`);
    return res.status(500).send('Internal Server Error');
  }

  const originalImageName = fs.readdirSync(fullFolderPath).find((file) => {
    return file.startsWith(id);
  });

  if (!originalImageName) {
    console.error(`Original image not found for ID ${id}`);
    return res.status(404).send('Image not found');
  }

  const originalImagePath = path.join(fullFolderPath, originalImageName);
  const scaledImagePath = path.join(
    thumbFolderPath,
    `${id}_${width}x${height}.jpg`
  );

  sharp(originalImagePath)
    .resize(parseInt(width as string), parseInt(height as string))
    .toFile(scaledImagePath, (error) => {
      if (error) {
        console.error('Error resizing and saving image:', error);
        return res.status(500).send('Internal Server Error');
      }

      res.sendFile(scaledImagePath);
    });
});

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
    <input type="text" id="widthInput" placeholder="width" />
    <input type="text" id="heightInput" placeholder="height" />
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
