import sharp from "sharp";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";

const assets = [
  { source: "public/images/student-uk.png", output: "public/images/student-uk.webp", width: 1000 },
  { source: "public/images/student-australia.png", output: "public/images/student-australia.webp", width: 1000 },
  { source: "public/images/student-canada.png", output: "public/images/student-canada.webp", width: 1000 },
  { source: "public/images/student-destinations.png", output: "public/images/student-destinations.webp", width: 1200 },
  { source: "public/images/destinations/italy.jpg", output: "public/images/destinations/italy.webp", width: 1800 },
  { source: "public/images/destinations/united-kingdom.jpg", output: "public/images/destinations/united-kingdom.webp", width: 1800 },
  { source: "public/images/destinations/niagara-falls.jpg", output: "public/images/destinations/niagara-falls.webp", width: 1800 },
  { source: "public/images/destinations/statue-of-liberty.jpg", output: "public/images/destinations/statue-of-liberty.webp", width: 1800 },
  { source: "public/images/destinations/thailand.jpg", output: "public/images/destinations/thailand.webp", width: 1800 },
];

let originalBytes = 0;
let optimizedBytes = 0;

for (const asset of assets) {
  const sourcePath = resolve(asset.source);
  const outputPath = resolve(asset.output);
  const sourceInfo = await stat(sourcePath);
  let outputInfo;

  try {
    outputInfo = await stat(outputPath);
  } catch {
    outputInfo = null;
  }

  if (!outputInfo || outputInfo.mtimeMs < sourceInfo.mtimeMs) {
    await sharp(sourcePath)
      .rotate()
      .resize({ width: asset.width, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath);
    outputInfo = await stat(outputPath);
  }

  if (outputInfo.size >= sourceInfo.size) {
    throw new Error(`Optimized image is not smaller than its source: ${asset.source}`);
  }

  originalBytes += sourceInfo.size;
  optimizedBytes += outputInfo.size;
  console.log(`${asset.source}: ${(sourceInfo.size / 1024 / 1024).toFixed(2)} MB -> ${(outputInfo.size / 1024 / 1024).toFixed(2)} MB`);
}

const reduction = ((1 - optimizedBytes / originalBytes) * 100).toFixed(1);
console.log(`Optimized ${assets.length} homepage images: ${(originalBytes / 1024 / 1024).toFixed(2)} MB -> ${(optimizedBytes / 1024 / 1024).toFixed(2)} MB (${reduction}% smaller)`);
