export type PointCandidate = {
  x: number;
  y: number;
  z: number;
  weight: number;
  brightness?: number;
};

export type FormationSet = {
  count: number;
  scatter: Float32Array;
  portrait: Float32Array;
  building: Float32Array;
  india: Float32Array;
  colors: Float32Array;
  randoms: Float32Array;
  brightness: Float32Array;
};

export function weightedSample(
  candidates: PointCandidate[],
  count: number,
  random: () => number,
  brightnessOut?: Float32Array,
): Float32Array {
  const positions = new Float32Array(count * 3);
  if (candidates.length === 0) return positions;

  const cumulative = new Float64Array(candidates.length);
  let total = 0;
  for (let i = 0; i < candidates.length; i += 1) {
    total += Math.max(0.0001, candidates[i].weight);
    cumulative[i] = total;
  }

  const pick = (target: number) => {
    let low = 0;
    let high = cumulative.length - 1;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (cumulative[mid] < target) low = mid + 1;
      else high = mid;
    }
    return candidates[low];
  };

  for (let i = 0; i < count; i += 1) {
    const candidate = pick(random() * total);
    const jitter = 0.0045;
    positions[i * 3] = candidate.x + (random() - 0.5) * jitter;
    positions[i * 3 + 1] = candidate.y + (random() - 0.5) * jitter;
    positions[i * 3 + 2] =
      candidate.z + (random() - 0.5) * jitter * 1.6;
    if (brightnessOut) {
      brightnessOut[i] = candidate.brightness ?? 1;
    }
  }

  return positions;
}

export function createColors(count: number, random: () => number) {
  const colors = new Float32Array(count * 3);
  const white = [0.96, 0.97, 1.0];
  const accent = [0.54, 0.71, 0.97];
  const highlight = [0.86, 0.9, 0.96];

  for (let i = 0; i < count; i += 1) {
    const roll = random();
    const base =
      roll > 0.965 ? highlight : roll > 0.88 ? accent : white;
    const variance = 0.92 + random() * 0.08;
    colors[i * 3] = base[0] * variance;
    colors[i * 3 + 1] = base[1] * variance;
    colors[i * 3 + 2] = base[2] * variance;
  }

  return colors;
}

export function createRandoms(count: number, random: () => number) {
  const randoms = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    randoms[i * 3] = random();
    randoms[i * 3 + 1] = random();
    randoms[i * 3 + 2] = random();
  }
  return randoms;
}

export function scatterFormation(count: number, random: () => number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const roll = random();
    if (roll < 0.72) {
      // A wide, shallow cloud that reads as an ambient star field.
      positions[i * 3] = (random() - 0.5) * 11;
      positions[i * 3 + 1] = (random() - 0.5) * 7;
      positions[i * 3 + 2] = (random() - 0.5) * 5 - 1.2;
    } else {
      // A few points sit closer to the centre so the first formation feels
      // like it is being pulled out of the field rather than appearing.
      positions[i * 3] = (random() - 0.5) * 4.6;
      positions[i * 3 + 1] = (random() - 0.5) * 3.6;
      positions[i * 3 + 2] = (random() - 0.5) * 2.4;
    }
  }

  return positions;
}

export function fitPositionsToBox(
  positions: Float32Array,
  width: number,
  height: number,
  centerY = 0,
) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < positions.length; i += 3) {
    minX = Math.min(minX, positions[i]);
    maxX = Math.max(maxX, positions[i]);
    minY = Math.min(minY, positions[i + 1]);
    maxY = Math.max(maxY, positions[i + 1]);
  }

  const sourceWidth = Math.max(0.0001, maxX - minX);
  const sourceHeight = Math.max(0.0001, maxY - minY);
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (positions[i] - cx) * scale;
    positions[i + 1] = (positions[i + 1] - cy) * scale + centerY;
  }

  return positions;
}
