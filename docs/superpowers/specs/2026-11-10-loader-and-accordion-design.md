# Particle Loader and Exclusive Project Descriptions

## Intent

Two refinements to the existing portfolio:

1. Replace the current orbiting-dot loader with a particle-reintegration
   loader: particles fly in from every direction, form a “YS” monogram, and a
   progress bar runs from 1 to 100. The hero is revealed only at 100.
2. Keep only one project description open at a time. Opening a new card
   closes the previously open card.

## Why

- The current loader has a decorative orbit and a progress bar that jumps
  between 68 and 100 without showing accumulation. A particle formation that
  assembles itself matches the portfolio's particle portrait and makes the
  wait feel intentional.
- Allowing several project descriptions to stay open makes the gallery tall
  and visually noisy, especially when the user opens a second card.

## Goals

- Loader particles start scattered across the whole viewport, converge into a
  readable “YS” monogram, and settle into a subtle idle drift.
- The progress bar starts at 1 and follows a smooth fixed ~2.1 s curve to 100;
  the last step to 100 waits for the portrait/font assets. The loader fades
  out after 100.
- Reduced-motion users see the finished monogram with no continuous motion
  and a quick transition.
- At most one project card is expanded at any time across desktop, mobile and
  reduced-motion layouts.

## Non-goals

- No changes to the particle portrait, project data, or gallery scroll
  behavior.
- No new dependencies or image assets.
- No backend or analytics changes.

## Approaches considered

### Loader formation

- **“YS” monogram sampled from canvas text (chosen).** Matches the brand mark
  in the navbar, is recognizable at 260 px, and can be generated without an
  asset.
- **A sphere or ring of particles.** Easier, but generic and less tied to the
  portfolio.
- **Keep the orbiting dots and only add a progress bar.** Does not meet the
  reintegration request.

### Progress behavior

- **Time-based, asset-gated progress (chosen).** The bar follows a smoothstep
  curve from 1 to 98 over about 2.1 seconds, then eases to 100 once assets are
  ready. If assets are slow, it holds at 98 instead of finishing early. The
  displayed percentage never goes backwards.
- **Immediate jump to 100 when ready.** Fast, but the loader disappears before
  the convergence reads as an animation.

### Exclusive descriptions

- **Lift the open project id into the gallery (chosen).** One state value
  controls every card in every layout; the card keeps an internal fallback
  when used alone.
- **DOM-based closing.** Fragile, crosses component boundaries, and misses
  the reduced-motion branch.

## Decisions

- The loader canvas fills the viewport, so particles begin across the entire
  screen rather than inside a small cluster.
- The loader monogram is drawn with a 900-weight sans-serif fallback so it
  renders before the web font finishes loading.
- Each particle gets a small randomized delay, start point, swirl and drift so
  the convergence feels organic rather than mechanical.
- The loader shows a three-digit counter (`001`–`100`) beside the bar.
- The loader holds at 100 for roughly 180 ms before fading over ~650 ms.
- Opening the currently open card closes it; opening another card closes the
  first and opens the second.

## Files expected to change

- `src/components/animation/LoadingScreen.tsx`
- `src/components/ui/ProjectCard.tsx`
- `src/components/animation/HorizontalProjectGallery.tsx`

## What is left to the builder

- Exact particle count, monogram scale and drift amplitude, tuned across phone
  and desktop viewports.
- Exact easing curve for the progress ramp.
