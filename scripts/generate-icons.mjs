import sharp from "sharp";
import { mkdir } from "fs/promises";
import { dirname } from "path";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0f172a" rx="20"/>
  <g fill="white" transform="translate(50,50)">
    <rect x="-35" y="-5" width="70" height="10" rx="2"/>
    <rect x="-40" y="-15" width="10" height="30" rx="2"/>
    <rect x="30" y="-15" width="10" height="30" rx="2"/>
    <rect x="-45" y="-10" width="5" height="20" rx="1"/>
    <rect x="40" y="-10" width="5" height="20" rx="1"/>
  </g>
</svg>
`;

const sizes = [192, 512];

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = `public/icon-${size}.png`;
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  }
}

generateIcons().catch(console.error);
