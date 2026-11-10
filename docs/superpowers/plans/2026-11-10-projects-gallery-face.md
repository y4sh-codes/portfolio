# Projects Gallery and Particle Face Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the projects heading, reveal project descriptions on card activation, give touch devices a native horizontal gallery, and make the particle portrait's nose and mouth read clearly.

**Architecture:** Keep one responsive project gallery driven by a `desktop` Tailwind breakpoint at 1180 px. Below it, the track is a native horizontal scroll container; above it, `gsap.matchMedia` builds the existing pinned vertical-scroll-to-horizontal animation. Extend the particle sampler with a nose/mouth feature mask and pass a per-point emphasis attribute to the shader for larger, brighter feature particles.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3.4, GSAP 3.15 with ScrollTrigger, three.js / React Three Fiber.

**Spec:** `docs/superpowers/specs/2026-11-10-projects-gallery-face-design.md`

## Global Constraints

- Desktop breakpoint is exactly `1180px`; below it, the gallery must use native horizontal scrolling.
- Project descriptions are 20–30 words and only visible when a card is expanded.
- Headings and supporting copy must not use the word “Four” for the project count.
- No new dependencies, image assets, or generated media.
- The card toggle must be keyboard accessible and must not intercept clicks on Repository or Live demo links.
- `npm run lint` and `npm run build` must both pass.
- Preserve the existing visual language and the reduced-motion fallback.

## Review Focus

- Clicking a Repository or Live demo link must open the link and must not toggle the card description.
- Pressing Enter or Space on a focused card must toggle the description and keep a visible focus outline.
- Swiping horizontally on a phone or tablet must move the gallery without moving the page vertically, and vertical swipes must still scroll the page.
- A user with reduced motion on a phone must still get the horizontal swipe gallery; the same user on desktop must get the static two-column grid.
- The nose/mouth emphasis must not brighten the shirt or background, and the dark moustache and nostrils must remain visible instead of being dimmed away.

---

### Task 1: Projects heading and expandable descriptions

**Files:**
- Modify: `src/components/ui/ProjectCard.tsx`
- Modify: `src/components/animation/HorizontalProjectGallery.tsx`
- Verify: `npm run lint`, `npm run build`

**Interfaces:**
- Consumes: `Project` from `src/data/projects.ts` with `id`, `index`, `name`, `tagline`, `description`, `tech`, `repo`, optional `demo`, `visual`.
- Produces: `ProjectCard({ project, layout = "horizontal" }: { project: Project; layout?: "horizontal" | "vertical" })` with internal expanded state. No new exports.

- [ ] **Step 1: Make `ProjectCard` a client component with an expandable description**

Add `"use client"` at the top. Import `useId`, `useState`, and `Minus`/`Plus` from `lucide-react`.

Inside the component:

```tsx
const [open, setOpen] = useState(false);
const descriptionId = useId();
```

Add a full-card toggle button as the first child of `<article>`, before the preview:

```tsx
<button
  type="button"
  className="absolute inset-0 z-0 cursor-pointer"
  aria-expanded={open}
  aria-controls={descriptionId}
  aria-label={`${open ? "Hide" : "Show"} details for ${project.name}`}
  onClick={() => setOpen((value) => !value)}
/>
```

Give the preview and the text content wrappers `relative z-10 pointer-events-none`, and add `pointer-events-auto` to every `<a>` so links sit above the toggle.

Replace the always-visible description with a collapsible region after the title/tagline row:

```tsx
<div
  id={descriptionId}
  aria-hidden={!open}
  className={cn(
    "grid transition-[grid-template-rows,opacity] duration-500 ease-cinematic",
    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
  )}
>
  <div className="overflow-hidden">
    <p className="mt-3 max-w-md text-[0.82rem] leading-relaxed text-muted">
      {project.description}
    </p>
  </div>
</div>
```

Add the discoverability cue beside the index:

```tsx
<span className="flex h-6 w-6 items-center justify-center border border-white/[0.12] text-accent/85">
  {open ? <Minus size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
</span>
```

Keep the existing tag list and Repository / Live demo footer below the description.

- [ ] **Step 2: Rename the headings and supporting copy**

In the animated layout of `HorizontalProjectGallery.tsx`, replace:

```tsx
Four projects<span className="text-accent">.</span>
```

with:

```tsx
Projects<span className="text-accent">.</span>
```

In the reduced-motion layout, replace the two-line `Selected / projects.` heading with:

```tsx
Projects<span className="text-muted">.</span>
```

Change the reduced-motion supporting paragraph to:

```tsx
A selection spanning multimodal AI, decentralised infrastructure, ocean
data and diffusion-model research.
```

- [ ] **Step 3: Verify**

Run: `npm run lint`
Expected: exits 0 with no errors.

Run: `npm run build`
Expected: “Compiled successfully” and a completed static generation step.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ProjectCard.tsx src/components/animation/HorizontalProjectGallery.tsx
git commit -m "feat: collapse project descriptions behind card toggle"
```

---

### Task 2: Native horizontal gallery below the desktop breakpoint

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/components/animation/HorizontalProjectGallery.tsx`
- Modify: `src/components/ui/ProjectCard.tsx` (compact card widths only)
- Verify: `npm run lint`, `npm run build`, Chromium screenshots at 390 px, 1024 px and 1440 px

**Interfaces:**
- Consumes: `ProjectCard` from Task 1 and `projects` data.
- Produces: `desktop` Tailwind screen at `1180px`; no runtime API changes.

- [ ] **Step 1: Add the desktop breakpoint**

In `tailwind.config.ts`, inside `theme.extend`, add:

```ts
screens: {
  desktop: "1180px",
},
```

- [ ] **Step 2: Make the main gallery responsive**

Keep the section `ref`, the `track` ref and the `progress` ref. Replace the fixed section height with:

```tsx
className="relative desktop:h-[420vh]"
```

Make the sticky wrapper sticky only on desktop:

```tsx
className="desktop:sticky desktop:top-0 desktop:flex desktop:h-[100svh] desktop:flex-col desktop:overflow-hidden"
```

In the track wrapper, keep `items-center`; on compact widths it should size to the cards. On the `track` element use:

```tsx
className="no-scrollbar flex w-full snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden px-[6vw] py-6 desktop:w-max desktop:snap-none desktop:overflow-visible desktop:gap-7 desktop:px-0 desktop:pb-0 desktop:pl-[6vw] desktop:pr-[8vw] desktop:py-0"
```

Add `snap-start` to the `<article>` class in `ProjectCard`.

Change the compact card width classes in `ProjectCard` from:

```tsx
"h-[62vh] w-[82vw] sm:w-[68vw] md:h-[66vh] md:w-[46vw] lg:w-[39vw] xl:w-[35vw]"
```

to:

```tsx
"h-[62vh] w-[82vw] sm:w-[68vw] md:h-[66vh] md:w-[58vw] desktop:w-[39vw] xl:w-[35vw]"
```

- [ ] **Step 3: Gate the GSAP animation to desktop**

Wrap the animation body in `gsap.matchMedia()`:

```tsx
const media = gsap.matchMedia();

media.add("(min-width: 1180px)", () => {
  // existing gsap.to(track.current, ...) and progress tween
});

return () => media.revert();
```

Leave the `reduced` early return in place so no animation is created for reduced-motion users. The `distance` helper stays inside the desktop callback.

- [ ] **Step 4: Update the header and footer labels**

In the header, keep the existing desktop-only block:

```tsx
<div className="hidden text-right desktop:block">
  ...Scroll to explore / Vertical scroll / horizontal motion...
</div>
```

Add a compact-only label:

```tsx
<div className="text-right desktop:hidden">
  <p className="label">Swipe to explore</p>
</div>
```

Wrap the `01 / progress / 04` footer in `hidden desktop:flex` so it does not appear in the swipe layout.

- [ ] **Step 5: Handle the reduced-motion branch**

In the `if (reduced)` return, keep the desktop two-column grid but hide it below `desktop`:

```tsx
<div className="hidden desktop:grid desktop:grid-cols-2 ...">
```

Add a compact-only horizontal track using the same card component:

```tsx
<div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden pb-6 desktop:hidden">
  {projects.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>
```

- [ ] **Step 6: Verify**

Run: `npm run lint`
Expected: exits 0 with no errors.

Run: `npm run build`
Expected: build completes successfully.

Start the production server and capture screenshots with Chromium:

```bash
npm run build && npm run start -- --port 3100
chromium --headless --disable-gpu --hide-scrollbars --virtual-time-budget=5000 --window-size=390,844 --screenshot=/tmp/opencode/portfolio/mobile-390.png http://localhost:3100
chromium --headless --disable-gpu --hide-scrollbars --virtual-time-budget=5000 --window-size=1024,768 --screenshot=/tmp/opencode/portfolio/tablet-1024.png http://localhost:3100
chromium --headless --disable-gpu --hide-scrollbars --virtual-time-budget=5000 --window-size=1440,900 --screenshot=/tmp/opencode/portfolio/desktop-1440.png http://localhost:3100
```

Expected: the 390 px and 1024 px screenshots show a horizontally scrollable card row with the next card peeking; the 1440 px screenshot keeps the pinned desktop layout.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.ts src/components/animation/HorizontalProjectGallery.tsx src/components/ui/ProjectCard.tsx
git commit -m "feat: use native horizontal project gallery on touch devices"
```

---

### Task 3: Nose and mouth features in the particle portrait

**Files:**
- Modify: `src/lib/particles/particleUtils.ts`
- Modify: `src/lib/particles/imageSampler.ts`
- Modify: `src/components/animation/ParticleField.tsx`
- Verify: `npm run lint`, `npm run build`, hero screenshot

**Interfaces:**
- Consumes: the existing portrait sampling pipeline.
- Produces:
  - `PointCandidate` gains optional `emphasis?: number`.
  - `FormationSet` gains `emphasis: Float32Array`.
  - `ImageParticleSample` gains `emphasis: Float32Array`.
  - `weightedSample(candidates, count, random, brightnessOut?, emphasisOut?)` fills emphasis when supplied.
  - `sampleImageToParticles` returns `{ positions, brightness, emphasis }`.
  - Shader attribute `aEmphasis` (float per particle).

- [ ] **Step 1: Carry emphasis through the particle utilities**

In `particleUtils.ts` add `emphasis?: number` to `PointCandidate` and `emphasis: Float32Array` to `FormationSet`.

Extend `weightedSample`:

```ts
export function weightedSample(
  candidates: PointCandidate[],
  count: number,
  random: () => number,
  brightnessOut?: Float32Array,
  emphasisOut?: Float32Array,
): Float32Array {
```

Inside the sampling loop, after writing brightness:

```ts
if (emphasisOut) {
  emphasisOut[i] = candidate.emphasis ?? 0;
}
```

- [ ] **Step 2: Add the feature mask to the portrait sampler**

In `imageSampler.ts`, extend the return type:

```ts
export type ImageParticleSample = {
  positions: Float32Array;
  brightness: Float32Array;
  emphasis: Float32Array;
};
```

Create `const emphasis = new Float32Array(count);` next to `brightness`, return it on every path, and pass it as the fifth argument to `weightedSample`.

Inside the candidate loop, after `faceBoost` is calculated, add ellipses for the nose and mouth:

```ts
const noseX = (u - 0.515) / 0.078;
const noseY = (v - 0.365) / 0.082;
const noseDist = noseX * noseX + noseY * noseY;

const mouthX = (u - 0.515) / 0.098;
const mouthY = (v - 0.492) / 0.062;
const mouthDist = mouthX * mouthX + mouthY * mouthY;

const feature = Math.max(
  noseDist < 1 ? 1 - noseDist : 0,
  mouthDist < 1 ? 1 - mouthDist : 0,
);
```

Use `feature` in the weight:

```ts
const featureBoost = 1 + feature * 2.4;
const weight =
  (0.1 + tone * 0.72 + edge * 1.6 + skinBoost) *
  (0.55 + a * 0.45) *
  vertical *
  faceBoost *
  featureBoost *
  bottomFade;
```

Use `feature` to keep dark feature pixels visible:

```ts
const featureBrightness = Math.max(
  l,
  0.34 + Math.min(1, edge * 2.1 + detail * 5) * 0.62,
);
const brightnessValue =
  l + (featureBrightness - l) * feature;

const featureEmphasis =
  feature * (0.45 + Math.min(1, edge * 2.4 + detail * 6) * 0.55);
```

Pass `brightness: brightnessValue` and `emphasis: featureEmphasis` in the candidate object.

- [ ] **Step 3: Add the emphasis attribute to the particle field**

In `ParticleField.tsx`:

- Add `attribute float aEmphasis;` to the vertex shader.
- Move the existing `portraitMask` calculation above the point-size calculation.
- Multiply the point size and raise the size ceiling:

```glsl
float emphasis = aEmphasis * portraitMask;
float size = mix(0.7, 2.1, aRandom.z) * (1.0 + emphasis * 0.9);
gl_PointSize = clamp(
  size * uPixelRatio * (9.0 / -mvPosition.z),
  1.0,
  3.4 + emphasis * 1.8
);
```

- Boost alpha after the luminance mix:

```glsl
vAlpha = min(
  1.0,
  uOpacity * (0.32 + aRandom.x * 0.68) * luminance * (1.0 + emphasis * 0.55)
);
```

- Slightly lift the dark end of the portrait brightness curve:

```glsl
0.36 + 0.64 * sqrt(clamp(aBrightness, 0.0, 1.0))
```

- Add `aEmphasis` to the generated `BufferGeometry`:

```ts
buffer.setAttribute(
  "aEmphasis",
  new THREE.BufferAttribute(formations.emphasis, 1),
);
```

- In the fallback formation object, add `emphasis: new Float32Array(count)`.
- In the success path, include `emphasis: portraitSample.emphasis` in the `setFormations` call.

- [ ] **Step 4: Verify**

Run: `npm run lint`
Expected: exits 0 with no errors.

Run: `npm run build`
Expected: build completes successfully.

Start the server and capture the hero at desktop size:

```bash
npm run build && npm run start -- --port 3100
chromium --headless --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=1440,900 --screenshot=/tmp/opencode/portfolio/hero-face.png http://localhost:3100
```

Inspect `/tmp/opencode/portfolio/hero-face.png` at full size. Expected: the nose bridge, nostril shadows, moustache and lip line are visible as defined clusters of points, and the shirt/background have not become brighter.

- [ ] **Step 5: Commit**

```bash
git add src/lib/particles/particleUtils.ts src/lib/particles/imageSampler.ts src/components/animation/ParticleField.tsx
git commit -m "feat: emphasise nose and mouth in particle portrait"
```

---

## Final Verification

- [ ] Run `npm run lint` and confirm exit 0.
- [ ] Run `npm run build` and confirm success.
- [ ] Capture 390 px, 1024 px and 1440 px screenshots and confirm the layout switches at 1180 px.
- [ ] Open a project card with mouse and keyboard, confirm the description expands, and confirm Repository / Live demo links still open.
- [ ] Confirm the condensed headings read “Projects” with no “Four”.
- [ ] Confirm the portrait's nose and mouth read more clearly than the surrounding skin.
