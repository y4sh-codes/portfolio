"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { experienceState } from "@/lib/animations/experienceState";
import { setupScrollExperience } from "@/lib/animations/scrollSetup";
import { ExperienceReadyProvider } from "./ExperienceContext";
import LoadingScreen from "./LoadingScreen";

const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), {
  ssr: false,
  loading: () => null,
});

function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...position };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const render = () => {
      position.x += (target.x - position.x) * 0.08;
      position.y += (target.y - position.y) * 0.08;
      if (glow.current) {
        glow.current.style.transform = `translate3d(${position.x - 220}px, ${
          position.y - 220
        }px, 0)`;
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glow}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[4] hidden h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(138,180,248,0.085),transparent_62%)] blur-[2px] md:block"
    />
  );
}

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.045] mix-blend-soft-light"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="portfolio-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#portfolio-grain)" />
      </svg>
    </div>
  );
}

export default function CinematicExperience({
  children,
}: {
  children: ReactNode;
}) {
  const [assetsReady, setAssetsReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const introStarted = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const handleAssetsReady = useCallback(() => {
    setAssetsReady(true);
  }, []);

  useEffect(() => {
    if (!assetsReady) return;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setReady(true);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(finish).catch(finish);
    } else {
      finish();
    }
    return () => {
      cancelled = true;
    };
  }, [assetsReady]);

  useEffect(() => {
    if (!ready || introStarted.current) return;
    introStarted.current = true;

    if (reducedMotion) {
      experienceState.stage = 1;
      experienceState.opacity = 0.92;
      experienceState.turbulence = 0.12;
      experienceState.groupX = 0;
      experienceState.groupY = window.innerWidth < 768 ? -0.12 : 0;
      experienceState.groupScale = 1;
    } else {
      experienceState.opacity = 0.08;
      experienceState.groupY = window.innerWidth < 768 ? -0.12 : 0;
      gsap.killTweensOf(experienceState);
      gsap.to(experienceState, {
        stage: 1,
        opacity: 1,
        duration: 2.5,
        delay: 0.12,
        ease: "power3.out",
      });
    }
  }, [ready, reducedMotion]);

  useEffect(() => {
    if (!ready) return;
    const cleanup = setupScrollExperience();
    const refresh = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 120);
    return () => {
      window.clearTimeout(refresh);
      cleanup();
    };
  }, [ready]);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  return (
    <ExperienceReadyProvider ready={ready}>
      <ParticleCanvas onReady={handleAssetsReady} />
      <CursorGlow />
      <GrainOverlay />
      <div className="relative z-10">{children}</div>
      {showLoader && (
        <LoadingScreen
          ready={ready}
          reducedMotion={reducedMotion}
          onComplete={() => setShowLoader(false)}
        />
      )}
    </ExperienceReadyProvider>
  );
}
