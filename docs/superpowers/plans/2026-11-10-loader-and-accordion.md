# Particle Loader and Exclusive Project Descriptions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the loader with a particle “YS” reintegration and 1–100 progress bar, and make project descriptions exclusive.

**Architecture:** `LoadingScreen` owns a canvas RAF loop that both raises progress toward asset readiness and draws particles from scattered starts into sampled “YS” targets. `HorizontalProjectGallery` owns a single `openId` value and passes controlled open/onToggle props to every `ProjectCard`; the card keeps internal state as a fallback when used independently.

**Tech Stack:** Next.js 15, React 19, TypeScript, Canvas 2D, GSAP, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-11-10-loader-and-accordion-design.md`

## Global Constraints

- No new dependencies or assets.
- The loader progress starts at 1, never decreases, and reaches 100 only after `ready` is true.
- The hero is revealed only after 100% and the fade-out.
- Reduced-motion users get a static finished monogram and a quick transition.
- Only one project card may be expanded at a time in every layout.
- `npm run lint` and `npm run build` must both pass.

## Review Focus

- If assets become ready before the bar finishes, progress must continue smoothly to 100 and the hero must open.
- If assets are slow, progress must crawl and hold below 100 rather than reveal an unready hero.
- Reduced-motion users must not get continuous particle animation.
- Opening a second project card must close the first in the main desktop gallery, the mobile swipe gallery and the reduced-motion layouts.
- Closing and reopening a card must keep the compact card height and description expansion working.

---

### Task 4: Particle reintegration loader

**Files:**
- Modify: `src/components/animation/LoadingScreen.tsx`
- Verify: `npm run lint`, `npm run build`, early-load screenshot, post-load screenshot

**Interfaces:**
- Consumes: existing `LoadingScreen({ ready, reducedMotion, onComplete })` props from `CinematicExperience`.
- Produces: no prop changes. Internal `LoaderParticle` becomes `{ startX, startY, targetX, targetY, size, delay, phase, accent }`.

- [ ] **Step 1: Replace the orbiting particle model**

Replace the existing `LoaderParticle` type and particle generation inside the canvas effect.

Create a deterministic target builder in the same file:

```ts
function buildMonogramTargets(size: number, count: number) {
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;
  const context = offscreen.getContext("2d", { willReadFrequently: true });
  const fallback = () =>
    Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      return {
        x: size / 2 + Math.cos(angle) * 86,
        y: size / 2 + Math.sin(angle) * 86,
      };
    });

  if (!context) return fallback();

  context.clearRect(0, 0, size, size);
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 112px Montserrat, system-ui, sans-serif";
  context.fillText("YS", size / 2, size / 2 - 4);

  const pixels = context.getImageData(0, 0, size, size).data;
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      if (pixels[(y * size + x) * 4 + 3] > 120) {
        points.push({ x, y });
      }
    }
  }
  if (points.length === 0) return fallback();

  return Array.from({ length: count }, (_, index) => {
    const point = points[(index * 97) % points.length];
    return {
      x: point.x + (Math.random() - 0.5) * 0.8,
      y: point.y + (Math.random() - 0.5) * 0.8,
    };
  });
}
```

Generate particles from those targets:

```ts
const targets = buildMonogramTargets(size, 180);
const particles: LoaderParticle[] = targets.map((target) => {
  const angle = Math.random() * Math.PI * 2;
  const radius = 190 + Math.random() * 260;
  return {
    startX: size / 2 + Math.cos(angle) * radius * 1.25,
    startY: size / 2 + Math.sin(angle) * radius,
    targetX: target.x,
    targetY: target.y,
    size: 0.7 + Math.random() * 1.4,
    delay: Math.random() * 0.28,
    phase: Math.random() * Math.PI * 2,
    accent: Math.random() > 0.88,
  };
});
```

- [ ] **Step 2: Drive progress and draw the convergence**

Add refs for progress and readiness at component scope:

```ts
const progressValue = useRef(1);
const lastShown = useRef(1);
const readyValue = useRef(ready);
```

Keep `readyValue.current = ready` in an effect.

Replace the canvas draw loop with one RAF loop that updates progress and draws. Use this shape:

```ts
const start = performance.now();

const draw = (now: number) => {
  const elapsed = (now - start) / 1000;
  const natural = reducedMotion
    ? 100
    : elapsed < 2.4
      ? 1 + 91 * (1 - Math.pow(1 - elapsed / 2.4, 3))
      : Math.min(98, 92 + (elapsed - 2.4) * 1.4);
  const target = readyValue.current ? 100 : natural;
  const rate = readyValue.current ? 0.11 : 0.07;

  progressValue.current +=
    (target - progressValue.current) * rate;
  if (readyValue.current && progressValue.current > 99.4) {
    progressValue.current = 100;
  }

  const shown = Math.max(1, Math.round(progressValue.current));
  if (shown !== lastShown.current) {
    lastShown.current = shown;
    setProgress(shown);
  }

  // drawing uses progressValue.current; see Step 3

  if (!reducedMotion) {
    raf = requestAnimationFrame(draw);
  }
};

raf = requestAnimationFrame(draw);
```

For reduced motion, call the draw once at `progressValue.current = 100`, set progress to 100, and do not schedule further frames.

- [ ] **Step 3: Draw the particles and monogram**

Inside the draw loop, after computing `elapsed`, render:

```ts
const formation = Math.min(1, progressValue.current / 100);
const globalEase = 1 - Math.pow(1 - formation, 3);
const center = size / 2;

context.clearRect(0, 0, size, size);

const glow = context.createRadialGradient(center, center, 0, center, center, 118);
glow.addColorStop(0, "rgba(138,180,248,0.11)");
glow.addColorStop(0.5, "rgba(255,255,255,0.03)");
glow.addColorStop(1, "rgba(0,0,0,0)");
context.fillStyle = glow;
context.fillRect(0, 0, size, size);

for (const particle of particles) {
  const local = Math.max(
    0,
    Math.min(1, (globalEase - particle.delay) / (1 - particle.delay)),
  );
  const ease = 1 - Math.pow(1 - local, 3);
  const swirl = (1 - ease) * 16;
  const drift = Math.sin(elapsed * 0.8 + particle.phase) * 0.8 * ease;
  const x =
    particle.startX +
    (particle.targetX - particle.startX) * ease +
    Math.cos(elapsed * 0.9 + particle.phase) * swirl +
    drift;
  const y =
    particle.startY +
    (particle.targetY - particle.startY) * ease +
    Math.sin(elapsed * 0.9 + particle.phase) * swirl;
  const alpha = 0.08 + ease * 0.92;
  const pointSize = particle.size * (0.7 + ease * 0.5);

  context.beginPath();
  context.fillStyle = particle.accent
    ? `rgba(138,180,248,${alpha})`
    : `rgba(255,255,255,${alpha})`;
  context.arc(x, y, pointSize, 0, Math.PI * 2);
  context.fill();
}
```

Keep the canvas at 260 CSS px with DPR scaling as it is today.

- [ ] **Step 4: Add the visible 1–100 progress bar**

Replace the existing bar markup:

```tsx
<div className="w-44">
  <div className="mb-3 flex items-end justify-between">
    <span className="label">Loading</span>
    <span className="text-[0.62rem] uppercase tracking-label text-muted">
      {String(progress).padStart(3, "0")}
    </span>
  </div>
  <div
    className="h-px w-full bg-white/10"
    role="progressbar"
    aria-valuemin={1}
    aria-valuemax={100}
    aria-valuenow={progress}
    aria-label="Loading progress"
  >
    <div
      className="h-px bg-paper transition-[width] duration-200 ease-linear"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
```

Start React state at 1: `useState(1)`.

- [ ] **Step 5: Gate the exit on 100%**

Change the exit effect so it starts only when both conditions are true:

```ts
if (!ready || progress < 100 || completed.current) return;
```

Keep the existing GSAP fade of `cluster` and `overlay`, but add a short hold:

```ts
const timeline = gsap.timeline({
  delay: 0.35,
  onComplete: () => onComplete(),
});
```

- [ ] **Step 6: Verify**

Run: `npm run lint` and `npm run build`.
Expected: both pass.

Start the production server and capture the loader early:

```bash
npm run build && npm run start -- --port 3100
```

Using the existing CDP helper, navigate and screenshot at ~1.2 s before the loader exits. Expected: the bar shows a low value and particles are visibly scattered around the “YS”.

Capture again after the loader exits. Expected: the hero is visible and no loader overlay remains.

- [ ] **Step 7: Commit**

```bash
git add src/components/animation/LoadingScreen.tsx
git commit -m "feat: animate particle loader into a YS monogram"
```

---

### Task 5: One open project description at a time

**Files:**
- Modify: `src/components/ui/ProjectCard.tsx`
- Modify: `src/components/animation/HorizontalProjectGallery.tsx`
- Verify: CDP interaction check, `npm run lint`, `npm run build`

**Interfaces:**
- Consumes: `ProjectCard` from the gallery.
- Produces: `ProjectCard` accepts optional `open?: boolean` and `onToggle?: () => void`. When `open` is supplied the card is controlled; otherwise it keeps internal state.
- Produces: `HorizontalProjectGallery` owns `openId: string | null`.

- [ ] **Step 1: Add controlled props to `ProjectCard`**

Change the signature:

```tsx
export default function ProjectCard({
  project,
  layout = "horizontal",
  open: controlledOpen,
  onToggle,
}: {
  project: Project;
  layout?: "horizontal" | "vertical";
  open?: boolean;
  onToggle?: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const toggle = () => {
    if (onToggle) onToggle();
    else setInternalOpen((value) => !value);
  };
```

Replace the button's `onClick={() => setOpen(...)}` with `onClick={toggle}`. All other `open` usages remain.

- [ ] **Step 2: Lift the open id into the gallery**

Import `useState`. Add at the top of the component:

```tsx
const [openId, setOpenId] = useState<string | null>(null);
const toggleProject = (id: string) =>
  setOpenId((current) => (current === id ? null : id));
```

Pass controlled props in every map. In the reduced-motion desktop grid:

```tsx
<ProjectCard
  key={project.id}
  project={project}
  layout="vertical"
  open={openId === project.id}
  onToggle={() => toggleProject(project.id)}
/>
```

In the reduced-motion compact track and the main animated track:

```tsx
<ProjectCard
  key={project.id}
  project={project}
  open={openId === project.id}
  onToggle={() => toggleProject(project.id)}
/>
```

- [ ] **Step 3: Verify**

Run: `npm run lint` and `npm run build`.
Expected: both pass.

Using the CDP helper at 1440 px and 390 px:

1. Open the first card.
2. Open the second card.
3. Confirm the first card's `aria-expanded` is `false` and the second is `true`.
4. Confirm the second card's description has a non-zero height.
5. Click the second card again and confirm it collapses.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ProjectCard.tsx src/components/animation/HorizontalProjectGallery.tsx
git commit -m "feat: keep only one project description open"
```

---

## Final Verification

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Loader shows 1–100, forms the “YS”, and reveals the hero after 100.
- [ ] Reduced-motion loader is static and still completes.
- [ ] Opening a second project closes the first at 1440 px and 390 px.
- [ ] Existing project headings, swipe gallery and card expansion still work.
