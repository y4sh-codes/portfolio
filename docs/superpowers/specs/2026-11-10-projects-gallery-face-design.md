# Projects gallery and particle face refinements

## Intent

Three focused refinements to the existing portfolio:

1. Rename the projects heading to “Projects” and reveal each project's
   description only when its card is activated.
2. Use native horizontal swiping for the project gallery on phones and
   tablets, while keeping the existing vertical-scroll-driven horizontal
   motion on desktop.
3. Make the particle portrait's nose and mouth read more clearly.

## Why

- The heading currently states a project count instead of naming the section.
- Keeping descriptions always visible competes with the project title and
  preview. Progressive disclosure keeps cards quieter while preserving the
  copy.
- On touch devices, visitors expect to swipe the gallery horizontally. The
  current pinned section consumes vertical scroll to move the cards, so a
  horizontal swipe appears broken.
- The source photo has sunglasses covering the eyes. The nose, moustache and
  mouth are the remaining recognisable facial features, but dark pixels are
  currently dimmed by the renderer, so those features fade away.

## Goals

- Both animated and reduced-motion layouts say “Projects”, with no “Four”
  count in the heading or supporting copy.
- Clicking or tapping a card toggles a 20–30 word description with a smooth
  expansion; links inside the card continue to work.
- Below 1180 px, the gallery is a native horizontal scroll region with snap
  points and normal vertical page scrolling.
- At 1180 px and above, the existing GSAP vertical-scroll-driven horizontal
  gallery remains unchanged.
- Nose bridge, nostrils, moustache and lips are visibly denser/brighter than
  the surrounding skin in the particle portrait.

## Non-goals

- No new projects, reordering, or visual redesign of the project previews.
- No changes to the hero/about/education/India/contact scenes.
- No new dependencies, image assets, or generated media.

## Constraints

- Preserve the existing dark/blue visual language and typography.
- Keep the current project data shape; only the meaning of `description`
  changes from always-visible to expandable.
- Must remain accessible: keyboard-operable toggle, correct `aria-expanded`
  state, and links not swallowed by the toggle.
- Must pass `npm run build` and `npm run lint`.

## Approaches considered

### Gallery scroll

- **Media-query-aware same DOM (chosen).** One card track. CSS makes the
  section static and horizontally scrollable below 1180 px; `gsap.matchMedia`
  only builds the pinned scroll animation at 1180 px and above. Avoids
  duplicated markup and gives native touch momentum.
- **Render two separate galleries behind CSS visibility.** Duplicates links
  and card DOM, risks two live animation contexts, and hurts maintenance.
- **Keep the pinned scroll on mobile and add drag handlers.** Fights the
  browser's native scroll, needs pointer/touch edge cases, and still leaves
  the page feeling wrong.

### Description expansion

- **Whole-card toggle with an overlay button (chosen).** The article gets a
  real button covering its surface, with interactive links layered above it.
  This makes the full card clickable, keeps nested interactive elements valid,
  and supports Enter/Space for free.
- **`<details>` element.** Semantic, but styling the whole card as the summary
  makes the preview and links awkward, and animating height is less reliable.
- **Expand only on a small “Details” link.** Simpler, but does not meet the
  request that clicking the card opens it.

### Face features

- **Feature-aware sampler + per-particle emphasis (chosen).** Add a
  nose/mouth mask in `imageSampler`, raise edge weight/brightness there, and
  pass an `emphasis` value to the shader to increase point size and alpha for
  those particles.
- **Post-process the portrait image.** Would alter the source asset and add a
  binary dependency; harder to tune and review.
- **Raise the whole portrait brightness.** Lifts the shirt and background too,
  reducing contrast instead of defining features.

## Decisions

- Desktop breakpoint is 1180 px, matching the existing `isTablet` boundary in
  `src/lib/device.ts`.
- Card descriptions are 20–30 words. Existing copy already meets this; Lopt,
  Atlas and Chimera are consistent with their GitHub descriptions. Context0
  keeps its current summary because its GitHub description is empty.
- The collapsed card keeps its current dimensions; the description expands
  within the existing content area on desktop and increases card height only
  in the auto-height reduced-motion layout.
- Add a small `+` / `−` affordance so the interaction is discoverable.
- On mobile the header reads “Swipe to explore”; desktop keeps “Vertical
  scroll / horizontal motion”.
- Face emphasis is applied only while stage 1 (portrait) is active so other
  formations are unaffected.

## Files expected to change

- `src/components/animation/HorizontalProjectGallery.tsx`
- `src/components/ui/ProjectCard.tsx`
- `src/lib/particles/imageSampler.ts`
- `src/lib/particles/particleUtils.ts`
- `src/components/animation/ParticleField.tsx`
- `src/app/globals.css` or `tailwind.config.ts` if a small helper utility is
  needed
- `src/data/projects.ts` only if a summary needs trimming

## What is left to the builder

- Exact easing/duration for the card expansion, within the existing cinematic
  motion language.
- Exact feature-mask geometry and emphasis strength, tuned against the source
  portrait.
- Whether to add a dedicated hook or keep the media query inside the gallery
  component; prefer the smallest change.
