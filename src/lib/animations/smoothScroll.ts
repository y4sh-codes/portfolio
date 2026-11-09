let activeAnimation: number | null = null;

/**
 * Perform a responsive, smooth scroll to a target vertical position using
 * cubic easing. Cancels cleanly if the user manually wheels or touches the screen.
 */
export function smoothScrollTo(
  targetY: number,
  duration = 750,
  onComplete?: () => void,
) {
  if (typeof window === "undefined") return;

  if (activeAnimation !== null) {
    cancelAnimationFrame(activeAnimation);
    activeAnimation = null;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    onComplete?.();
    return;
  }

  const startTime = performance.now();

  const cancel = () => {
    if (activeAnimation !== null) {
      cancelAnimationFrame(activeAnimation);
      activeAnimation = null;
    }
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchmove", cancel);
  };

  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchmove", cancel, { passive: true, once: true });

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      activeAnimation = requestAnimationFrame(step);
    } else {
      activeAnimation = null;
      window.scrollTo(0, targetY);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      onComplete?.();
    }
  }

  activeAnimation = requestAnimationFrame(step);
}
