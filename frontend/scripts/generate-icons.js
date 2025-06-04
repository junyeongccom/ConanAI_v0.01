const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 16, name: 'favicon-16x16' },
  { size: 32, name: 'favicon-32x32' },
  { size: 48, name: 'icon-48x48' },
  { size: 72, name: 'icon-72x72' },
  { size: 96, name: 'icon-96x96' },
  { size: 128, name: 'icon-128x128' },
  { size: 144, name: 'icon-144x144' },
  { size: 152, name: 'icon-152x152' },
  { size: 192, name: 'icon-192x192' },
  { size: 384, name: 'icon-384x384' },
  { size: 512, name: 'icon-512x512' }
];

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/icon/icon.svg'));
  
  for (const { size, name } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../public/icon/${name}.png`));
  }

  // Generate apple-touch-icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/icon/apple-touch-icon.png'));

  // Generate maskable icon (512x512 with padding)
  await sharp(svgBuffer)
    .resize(512, 512)
    .extend({
      top: 64,
      bottom: 64,
      left: 64,
      right: 64,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(__dirname, '../public/icon/maskable-icon.png'));
}

generateIcons().catch(console.error); 