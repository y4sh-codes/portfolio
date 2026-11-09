import { mulberry32, randomRange, type Random } from "./rng";
import { weightedSample, type PointCandidate } from "./particleUtils";

type Segment = {
  a: [number, number, number];
  b: [number, number, number];
  weight?: number;
  density?: number;
};

type Surface = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  z: number;
  weight?: number;
};

type Column = {
  x: number;
  z: number;
  radius: number;
  bottom: number;
  top: number;
};

function addSegment(
  candidates: PointCandidate[],
  segment: Segment,
  random: Random,
) {
  const { a, b, weight = 1, density = 110 } = segment;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const samples = Math.max(3, Math.round(length * density));
  for (let i = 0; i < samples; i += 1) {
    const t = random();
    candidates.push({
      x: a[0] + dx * t + (random() - 0.5) * 0.005,
      y: a[1] + dy * t + (random() - 0.5) * 0.005,
      z: a[2] + dz * t + (random() - 0.5) * 0.005,
      weight,
    });
  }
}

function addSurface(
  candidates: PointCandidate[],
  surface: Surface,
  random: Random,
) {
  const { x1, y1, x2, y2, z, weight = 0.2 } = surface;
  const area = Math.abs((x2 - x1) * (y2 - y1));
  const samples = Math.max(6, Math.round(area * 620));
  for (let i = 0; i < samples; i += 1) {
    candidates.push({
      x: randomRange(random, x1, x2),
      y: randomRange(random, y1, y2),
      z: z + (random() - 0.5) * 0.012,
      weight,
    });
  }
}

function addColumn(
  candidates: PointCandidate[],
  column: Column,
  random: Random,
) {
  const samples = 420;
  for (let i = 0; i < samples; i += 1) {
    const theta = random() * Math.PI * 2;
    const y = randomRange(random, column.bottom, column.top);
    candidates.push({
      x: column.x + Math.cos(theta) * column.radius,
      y,
      z: column.z + Math.sin(theta) * column.radius,
      weight: 1.25,
    });
  }

  // Capital and base rings give the columns a classical silhouette.
  for (const y of [column.bottom, column.top]) {
    for (let i = 0; i < 90; i += 1) {
      const theta = random() * Math.PI * 2;
      candidates.push({
        x: column.x + Math.cos(theta) * column.radius * 1.7,
        y: y + (random() - 0.5) * 0.02,
        z: column.z + Math.sin(theta) * column.radius * 1.7,
        weight: 1.1,
      });
    }
  }
}

function addWindow(
  candidates: PointCandidate[],
  cx: number,
  cy: number,
  width: number,
  height: number,
  z: number,
  random: Random,
) {
  const halfW = width / 2;
  const halfH = height / 2;
  const x1 = cx - halfW;
  const x2 = cx + halfW;
  const y1 = cy - halfH;
  const y2 = cy + halfH;

  const outline: Segment[] = [
    { a: [x1, y1, z], b: [x2, y1, z], weight: 1.5, density: 150 },
    { a: [x2, y1, z], b: [x2, y2, z], weight: 1.5, density: 150 },
    { a: [x2, y2, z], b: [x1, y2, z], weight: 1.5, density: 150 },
    { a: [x1, y2, z], b: [x1, y1, z], weight: 1.5, density: 150 },
    { a: [cx, y1, z], b: [cx, y2, z], weight: 0.9, density: 90 },
    { a: [x1, cy, z], b: [x2, cy, z], weight: 0.9, density: 90 },
  ];
  for (const segment of outline) addSegment(candidates, segment, random);
}

function addArch(
  candidates: PointCandidate[],
  cx: number,
  baseY: number,
  width: number,
  height: number,
  z: number,
  random: Random,
) {
  const halfW = width / 2;
  const springY = baseY + height - halfW;
  addSegment(
    candidates,
    { a: [cx - halfW, baseY, z], b: [cx - halfW, springY, z], weight: 2, density: 180 },
    random,
  );
  addSegment(
    candidates,
    { a: [cx + halfW, baseY, z], b: [cx + halfW, springY, z], weight: 2, density: 180 },
    random,
  );
  for (let i = 0; i < 160; i += 1) {
    const theta = Math.PI + (random() * Math.PI);
    candidates.push({
      x: cx + Math.cos(theta) * halfW,
      y: springY + Math.sin(theta) * halfW,
      z,
      weight: 2.1,
    });
  }
  // Door leaves.
  for (let i = 0; i < 70; i += 1) {
    candidates.push({
      x: cx + (random() - 0.5) * width * 0.85,
      y: randomRange(random, baseY, springY),
      z: z - 0.01,
      weight: 0.35,
    });
  }
}

/**
 * A procedural classical faculty building. The geometry is deliberately
 * architectural — a symmetrical facade, columns, pediment, dome, wings,
 * windows, entrance arch and steps — rather than a cartoon illustration.
 */
export function generateBuildingParticles(
  count: number,
  seed = 137,
): Float32Array {
  const random = mulberry32(seed);
  const candidates: PointCandidate[] = [];

  const facadeZ = 0;
  const columnZ = 0.16;

  // Central block.
  addSurface(
    candidates,
    { x1: -0.98, y1: -0.95, x2: 0.98, y2: 0.72, z: facadeZ, weight: 0.12 },
    random,
  );
  const centralEdges: Segment[] = [
    { a: [-0.98, -0.95, 0], b: [0.98, -0.95, 0], weight: 1.2 },
    { a: [0.98, -0.95, 0], b: [0.98, 0.72, 0], weight: 1.2 },
    { a: [0.98, 0.72, 0], b: [-0.98, 0.72, 0], weight: 1.2 },
    { a: [-0.98, 0.72, 0], b: [-0.98, -0.95, 0], weight: 1.2 },
    { a: [-0.98, 0.72, 0.06], b: [0.98, 0.72, 0.06], weight: 1.6, density: 170 },
    { a: [-0.98, -0.95, 0.06], b: [0.98, -0.95, 0.06], weight: 1.2 },
  ];
  for (const edge of centralEdges) addSegment(candidates, edge, random);

  // Pediment.
  const pediment: Segment[] = [
    { a: [-1.04, 0.72, 0.02], b: [1.04, 0.72, 0.02], weight: 1.8, density: 170 },
    { a: [-1.04, 0.72, 0.02], b: [0, 1.28, 0.02], weight: 1.8, density: 150 },
    { a: [1.04, 0.72, 0.02], b: [0, 1.28, 0.02], weight: 1.8, density: 150 },
    { a: [-0.82, 0.82, 0.05], b: [0.82, 0.82, 0.05], weight: 0.9 },
    { a: [-0.56, 0.94, 0.05], b: [0.56, 0.94, 0.05], weight: 0.7 },
  ];
  for (const edge of pediment) addSegment(candidates, edge, random);

  // Dome and drum, set slightly behind the pediment.
  const domeCenter = { x: 0, y: 1.12, z: -0.18, r: 0.27 };
  for (let i = 0; i < 900; i += 1) {
    const theta = random() * Math.PI * 2;
    const phi = random() * Math.PI * 0.5;
    candidates.push({
      x: domeCenter.x + Math.cos(theta) * Math.sin(phi) * domeCenter.r,
      y: domeCenter.y + Math.cos(phi) * domeCenter.r,
      z: domeCenter.z + Math.sin(theta) * Math.sin(phi) * domeCenter.r,
      weight: 1.35,
    });
  }
  addSegment(
    candidates,
    { a: [-0.29, 1.06, -0.18], b: [0.29, 1.06, -0.18], weight: 1.2 },
    random,
  );
  addSegment(
    candidates,
    { a: [0, 1.39, -0.18], b: [0, 1.52, -0.18], weight: 1.6, density: 180 },
    random,
  );

  // Columns.
  const columnXs = [-0.74, -0.45, -0.16, 0.16, 0.45, 0.74];
  for (const x of columnXs) {
    addColumn(
      candidates,
      { x, z: columnZ, radius: 0.038, bottom: -0.92, top: 0.62 },
      random,
    );
  }

  // Entrance arch and door.
  addArch(candidates, 0, -0.93, 0.44, 0.86, 0.03, random);

  // Side wings.
  addSurface(
    candidates,
    { x1: -1.88, y1: -0.95, x2: -1.02, y2: 0.4, z: facadeZ, weight: 0.1 },
    random,
  );
  addSurface(
    candidates,
    { x1: 1.02, y1: -0.95, x2: 1.88, y2: 0.4, z: facadeZ, weight: 0.1 },
    random,
  );

  const wingEdges: Segment[] = [
    { a: [-1.88, -0.95, 0], b: [-1.02, -0.95, 0], weight: 1.1 },
    { a: [-1.88, 0.4, 0], b: [-1.02, 0.4, 0], weight: 1.3 },
    { a: [-1.88, -0.95, 0], b: [-1.88, 0.4, 0], weight: 1.2 },
    { a: [-1.02, -0.95, 0], b: [-1.02, 0.4, 0], weight: 1.1 },
    { a: [1.02, -0.95, 0], b: [1.88, -0.95, 0], weight: 1.1 },
    { a: [1.02, 0.4, 0], b: [1.88, 0.4, 0], weight: 1.3 },
    { a: [1.88, -0.95, 0], b: [1.88, 0.4, 0], weight: 1.2 },
    { a: [1.02, -0.95, 0], b: [1.02, 0.4, 0], weight: 1.1 },
    { a: [-1.88, 0.4, 0.06], b: [1.88, 0.4, 0.06], weight: 1.4, density: 170 },
    { a: [-1.88, -0.95, 0.06], b: [1.88, -0.95, 0.06], weight: 1.2 },
  ];
  for (const edge of wingEdges) addSegment(candidates, edge, random);

  // Pilasters on the wings.
  for (const x of [-1.84, -1.46, -1.04, 1.04, 1.46, 1.84]) {
    addSegment(
      candidates,
      { a: [x, -0.95, 0.05], b: [x, 0.4, 0.05], weight: 1.1, density: 100 },
      random,
    );
  }

  // Windows, three rows per wing.
  for (const side of [-1, 1]) {
    for (const x of [1.2, 1.6]) {
      for (const y of [-0.68, -0.28, 0.12]) {
        addWindow(candidates, side * x, y, 0.2, 0.24, 0.07, random);
      }
    }
  }

  // Upper central windows between the columns.
  for (const x of [-0.6, 0.6]) {
    addWindow(candidates, x, 0.36, 0.18, 0.28, 0.04, random);
  }

  // Steps and plinth.
  const stepLines = [-1.0, -1.07, -1.14, -1.21];
  for (let i = 0; i < stepLines.length; i += 1) {
    const y = stepLines[i];
    const width = 2.5 + i * 0.16;
    addSegment(
      candidates,
      {
        a: [-width / 2, y, 0.2 + i * 0.08],
        b: [width / 2, y, 0.2 + i * 0.08],
        weight: 1.6,
        density: 170,
      },
      random,
    );
    addSegment(
      candidates,
      {
        a: [-width / 2, y, 0.2 + i * 0.08],
        b: [-width / 2, y + 0.07, 0.2 + i * 0.08],
        weight: 1.1,
      },
      random,
    );
    addSegment(
      candidates,
      {
        a: [width / 2, y, 0.2 + i * 0.08],
        b: [width / 2, y + 0.07, 0.2 + i * 0.08],
        weight: 1.1,
      },
      random,
    );
  }
  addSegment(
    candidates,
    { a: [-2.02, -1.23, 0.02], b: [2.02, -1.23, 0.02], weight: 1.5, density: 180 },
    random,
  );

  // A few finials and roofline accents.
  for (const x of [-1.9, 1.9]) {
    addSegment(
      candidates,
      { a: [x, 0.4, 0], b: [x, 0.62, 0], weight: 1.2 },
      random,
    );
  }

  const positions = weightedSample(candidates, count, random);
  // Centre the building vertically.
  for (let i = 1; i < positions.length; i += 3) {
    positions[i] -= 0.08;
  }
  return positions;
}
