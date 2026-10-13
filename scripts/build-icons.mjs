import { readFile, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile(
  new URL("../public/brand/portfolio-shield.svg", import.meta.url),
);
const root = new URL("../public/", import.meta.url);
const sizes = [16, 32, 48, 180, 192, 512];
const names = new Map([
  [16, "favicon-16.png"],
  [32, "favicon-32.png"],
  [48, "favicon-48.png"],
  [180, "apple-touch-icon.png"],
  [192, "icon-192.png"],
  [512, "icon-512.png"],
]);
const images = new Map();
for (const size of sizes) {
  const png = await sharp(svg).resize(size, size).png().toBuffer();
  images.set(size, png);
  await writeFile(new URL(names.get(size), root), png);
}
await copyFile(
  new URL("../public/brand/portfolio-shield.svg", import.meta.url),
  new URL("favicon.svg", root),
);
await writeFile(new URL("favicon.png", root), images.get(32));

// ICO supports PNG entries, retaining transparent edges at each native size.
const icoSizes = [16, 32, 48];
const header = Buffer.alloc(6 + icoSizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
let offset = header.length;
icoSizes.forEach((size, i) => {
  const png = images.get(size);
  const start = 6 + i * 16;
  header[start] = size;
  header[start + 1] = size;
  header.writeUInt16LE(1, start + 4);
  header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(png.length, start + 8);
  header.writeUInt32LE(offset, start + 12);
  offset += png.length;
});
await writeFile(
  new URL("favicon.ico", root),
  Buffer.concat([header, ...icoSizes.map((size) => images.get(size))]),
);
