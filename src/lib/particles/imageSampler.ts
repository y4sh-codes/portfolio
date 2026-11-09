import { mulberry32 } from "./rng";
import {
  weightedSample,
  type PointCandidate,
} from "./particleUtils";

export type ImageSampleOptions = {
  count: number;
  cropLeft?: number;
  cropRight?: number;
  cropTop?: number;
  cropBottom?: number;
  sampleWidth?: number;
  worldHeight?: number;
  seed?: number;
};

function isBrowser() {
  return typeof document !== "undefined";
}

export type ImageParticleSample = {
  positions: Float32Array;
  brightness: Float32Array;
};

/**
 * Converts the supplied portrait into a point cloud by sampling the alpha,
 * luminance and edges of the cut-out image. Dark areas are retained through
 * silhouette-edge weighting, so hair and sunglasses do not disappear.
 *
 * Each point also carries its source luminance. The renderer uses that to
 * modulate particle brightness, which is what makes the nose, mouth and beard
 * read as features instead of a flat silhouette.
 */
export function sampleImageToParticles(
  image: HTMLImageElement,
  {
    count,
    cropLeft = 0.12,
    cropRight = 0.88,
    cropTop = 0.015,
    cropBottom = 0.56,
    sampleWidth = 340,
    worldHeight = 3.2,
    seed = 23,
  }: ImageSampleOptions,
): ImageParticleSample {
  const brightness = new Float32Array(count);
  if (!isBrowser()) {
    return { positions: new Float32Array(count * 3), brightness };
  }

  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceX = Math.floor(sourceWidth * cropLeft);
  const sourceY = Math.floor(sourceHeight * cropTop);
  const sourceCropWidth = Math.max(1, Math.floor(sourceWidth * (cropRight - cropLeft)));
  const sourceCropHeight = Math.max(
    1,
    Math.floor(sourceHeight * (cropBottom - cropTop)),
  );
  const aspect = sourceCropWidth / sourceCropHeight;
  const canvasWidth = sampleWidth;
  const canvasHeight = Math.max(1, Math.round(canvasWidth / aspect));

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return { positions: new Float32Array(count * 3), brightness };
  }

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceCropWidth,
    sourceCropHeight,
    0,
    0,
    canvasWidth,
    canvasHeight,
  );

  const pixels = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
  const luma = new Float32Array(canvasWidth * canvasHeight);
  const alpha = new Float32Array(canvasWidth * canvasHeight);

  for (let y = 0; y < canvasHeight; y += 1) {
    for (let x = 0; x < canvasWidth; x += 1) {
      const index = y * canvasWidth + x;
      const p = index * 4;
      alpha[index] = pixels[p + 3] / 255;
      luma[index] =
        (0.2126 * pixels[p] + 0.7152 * pixels[p + 1] + 0.0722 * pixels[p + 2]) /
        255;
    }
  }

  const candidates: PointCandidate[] = [];
  const worldWidth = worldHeight * aspect;
  const random = mulberry32(seed);

  for (let y = 1; y < canvasHeight - 1; y += 1) {
    for (let x = 1; x < canvasWidth - 1; x += 1) {
      const index = y * canvasWidth + x;
      const a = alpha[index];
      if (a < 0.18) continue;

      const l = luma[index];
      const left = luma[index - 1];
      const right = luma[index + 1];
      const up = luma[index - canvasWidth];
      const down = luma[index + canvasWidth];
      const lumaEdge = Math.max(
        Math.abs(l - left),
        Math.abs(l - right),
        Math.abs(l - up),
        Math.abs(l - down),
      );
      const alphaEdge = Math.max(
        Math.abs(a - alpha[index - 1]),
        Math.abs(a - alpha[index + 1]),
        Math.abs(a - alpha[index - canvasWidth]),
        Math.abs(a - alpha[index + canvasWidth]),
      );
      const localMean = (l * 2 + left + right + up + down) / 6;
      const detail = Math.abs(l - localMean);
      const edge = Math.min(
        1,
        lumaEdge * 3.2 + alphaEdge * 1.5 + detail * 9,
      );

      const p = index * 4;
      const red = pixels[p];
      const green = pixels[p + 1];
      const blue = pixels[p + 2];
      const isSkin =
        red > 58 &&
        red > green * 1.035 &&
        green > blue * 0.94 &&
        red > blue * 1.06;
      const skinBoost = isSkin ? 0.22 : 0;

      const u = (x + 0.5) / canvasWidth;
      const v = (y + 0.5) / canvasHeight;
      const bottomFade = Math.min(1, (1 - v) * 7);
      if (bottomFade <= 0.02) continue;

      // Tone curve keeps bright planes (nose, cheeks, lips) populated while
      // thinning the shadows (nostrils, moustache, beard) so features read.
      const tone = 0.14 + 0.86 * Math.pow(Math.max(0, l), 1.55);

      // Bias the point budget toward the head and shoulders so the face keeps
      // its detail instead of being outnumbered by the white shirt.
      const vertical = Math.max(0.5, 1.18 - 0.55 * v);

      // Gentle face-region lift. The feature definition comes from the tone
      // curve and luminance brightness, not from flooding the face evenly.
      const fx = (u - 0.505) / 0.165;
      const fy = (v - 0.315) / 0.175;
      const faceDist = fx * fx + fy * fy;
      const faceBoost = faceDist < 1 ? 1 + 1.1 * (1 - faceDist) : 1;

      const weight =
        (0.1 + tone * 0.72 + edge * 1.6 + skinBoost) *
        (0.55 + a * 0.45) *
        vertical *
        faceBoost *
        bottomFade;
      if (weight < 0.12) continue;

      candidates.push({
        x: (u - 0.5) * worldWidth,
        y: (0.5 - v) * worldHeight,
        z: (l - 0.5) * 0.18 + (random() - 0.5) * 0.06,
        weight,
        brightness: l,
      });
    }
  }

  return {
    positions: weightedSample(candidates, count, random, brightness),
    brightness,
  };
}
