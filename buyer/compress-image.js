import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inputPath = path.join(__dirname, 'public', 'pouch.png');
const outputPath = path.join(__dirname, 'public', 'pouch.webp');

console.log(`Starting compression from ${inputPath} to ${outputPath}...`);

sharp(inputPath)
  .webp({ quality: 75 }) // Highly optimized quality
  .toFile(outputPath)
  .then(info => {
    console.log('Image compressed successfully!');
    console.log(`Format: ${info.format}`);
    console.log(`Dimensions: ${info.width}x${info.height}`);
    console.log(`Size: ${(info.size / 1024).toFixed(2)} KB`);
  })
  .catch(err => {
    console.error('Error compressing image:', err);
    process.exit(1);
  });
