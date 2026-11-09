import { mulberry32 } from "./rng";
import { weightedSample, type PointCandidate } from "./particleUtils";

export type SvgSampleOptions = {
  count: number;
  sampleSize?: number;
  worldHeight?: number;
  seed?: number;
};

/**
 * Rasterises a vector outline at runtime and samples its alpha channel.
 * The India outline is bundled locally (public/images/india-map.svg), so
 * the resulting map is deterministic and geographically faithful.
 */
export function sampleSVGToParticles(
  image: HTMLImageElement,
  {
    count,
    sampleSize = 460,
    worldHeight = 3.15,
    seed = 71,
  }: SvgSampleOptions,
): Float32Array {
  if (typeof document === "undefined") return new Float32Array(count * 3);

  const canvas = document.createElement("canvas");
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return new Float32Array(count * 3);

  context.clearRect(0, 0, sampleSize, sampleSize);
  context.drawImage(image, 0, 0, sampleSize, sampleSize);
  const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;

  const alpha = new Float32Array(sampleSize * sampleSize);
  let minX = sampleSize;
  let maxX = 0;
  let minY = sampleSize;
  let maxY = 0;

  for (let y = 0; y < sampleSize; y += 1) {
    for (let x = 0; x < sampleSize; x += 1) {
      const index = y * sampleSize + x;
      const a = pixels[index * 4 + 3] / 255;
      alpha[index] = a;
      if (a > 0.12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX >= maxX || minY >= maxY) return new Float32Array(count * 3);

  const sourceWidth = maxX - minX + 1;
  const sourceHeight = maxY - minY + 1;
  const aspect = sourceWidth / sourceHeight;
  const worldWidth = worldHeight * aspect;
  const random = mulberry32(seed);
  const candidates: PointCandidate[] = [];

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const index = y * sampleSize + x;
      const a = alpha[index];
      if (a < 0.12) continue;

      const edge = Math.max(
        alpha[index - 1] < 0.12 ? 1 : 0,
        alpha[index + 1] < 0.12 ? 1 : 0,
        alpha[index - sampleSize] < 0.12 ? 1 : 0,
        alpha[index + sampleSize] < 0.12 ? 1 : 0,
      );

      const u = (x - minX) / sourceWidth;
      const v = (y - minY) / sourceHeight;
      candidates.push({
        x: (u - 0.5) * worldWidth,
        y: (0.5 - v) * worldHeight,
        z: (random() - 0.5) * 0.06,
        weight: edge ? 2.4 : 0.34 + a * 0.22,
      });
    }
  }

  return weightedSample(candidates, count, random);
}
