// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'src/images');
const formats = ['.jpg', '.jpeg', '.png'];

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file, ext);

  if (!formats.includes(ext)) return; // Hoppa över om inte JPG/PNG

  const inputPath = path.join(inputDir, file);

  // Skapa WebP
  sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(path.join(inputDir, `${name}.webp`))
    .then(() => console.log(`✅ WebP skapad: ${name}.webp`))
    .catch(err => console.error(err));

  // Skapa AVIF
  sharp(inputPath)
    .avif({ quality: 50 })
    .toFile(path.join(inputDir, `${name}.avif`))
    .then(() => console.log(`✅ AVIF skapad: ${name}.avif`))
    .catch(err => console.error(err));
});
