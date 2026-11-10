"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type LoadingScreenProps = {
  ready: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
};

type LoaderParticle = {
  startNX: number;
  startNY: number;
  targetNX: number;
  targetNY: number;
  size: number;
  delay: number;
  phase: number;
  swirl: number;
  accent: boolean;
};

const RAMP_SECONDS = 2.1;
const MIN_PARTICLES = 320;
const MAX_PARTICLES = 800;

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function buildMonogramTargets(count: number) {
  const sampleWidth = 460;
  const sampleHeight = 230;
  const offscreen = document.createElement("canvas");
  offscreen.width = sampleWidth;
  offscreen.height = sampleHeight;
  const context = offscreen.getContext("2d", { willReadFrequently: true });

  const fallback = () =>
    Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      return {
        nx: (Math.cos(angle) * 0.34) / 2,
        ny: (Math.sin(angle) * 0.34) / 2,
      };
    });

  if (!context) return fallback();

  context.clearRect(0, 0, sampleWidth, sampleHeight);
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 180px Montserrat, system-ui, sans-serif";
  context.fillText("YS", sampleWidth / 2, sampleHeight / 2 + 4);

  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const points: { nx: number; ny: number }[] = [];
  for (let y = 0; y < sampleHeight; y += 2) {
    for (let x = 0; x < sampleWidth; x += 2) {
      if (pixels[(y * sampleWidth + x) * 4 + 3] > 128) {
        points.push({
          nx: (x - sampleWidth / 2) / sampleWidth,
          ny: (y - sampleHeight / 2) / sampleWidth,
        });
      }
    }
  }
  if (points.length === 0) return fallback();

  return Array.from({ length: count }, (_, index) => {
    const point = points[(index * 97) % points.length];
    return {
      nx: point.nx + (Math.random() - 0.5) * 0.003,
      ny: point.ny + (Math.random() - 0.5) * 0.003,
    };
  });
}

export default function LoadingScreen({
  ready,
  reducedMotion,
  onComplete,
}: LoadingScreenProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const cluster = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(1);
  const completed = useRef(false);
  const progressValue = useRef(1);
  const lastShown = useRef(1);
  const readyValue = useRef(ready);

  useEffect(() => {
    readyValue.current = ready;
  }, [ready]);

  useEffect(() => {
    if (!ready || progress < 100 || completed.current) return;
    completed.current = true;

    const duration = reducedMotion ? 0.01 : 0.65;
    const timeline = gsap.timeline({
      delay: 0.18,
      onComplete: () => onComplete(),
    });

    if (cluster.current) {
      timeline.to(
        cluster.current,
        {
          scale: reducedMotion ? 1 : 1.06,
          opacity: 0,
          duration,
          ease: "power2.inOut",
        },
        0,
      );
    }

    if (overlay.current) {
      timeline.to(
        overlay.current,
        {
          opacity: 0,
          duration,
          ease: "power2.inOut",
        },
        0.04,
      );
    }

    return () => {
      timeline.kill();
    };
  }, [ready, progress, reducedMotion, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const applySize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    applySize();

    const count = Math.round(
      Math.min(
        MAX_PARTICLES,
        Math.max(MIN_PARTICLES, (width * height) / 2000),
      ),
    );
    const targets = buildMonogramTargets(count);
    const particles: LoaderParticle[] = targets.map((target) => ({
      startNX: Math.random() * 1.14 - 0.07,
      startNY: Math.random() * 1.14 - 0.07,
      targetNX: target.nx,
      targetNY: target.ny,
      size: 0.45 + Math.random() * 1,
      delay: Math.random() * 0.24,
      phase: Math.random() * Math.PI * 2,
      swirl: 18 + Math.random() * 70,
      accent: Math.random() > 0.87,
    }));

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;

      if (!reducedMotion) {
        const ramp = 1 + 97 * smoothstep(elapsed / RAMP_SECONDS);
        if (!readyValue.current) {
          progressValue.current = Math.min(98, ramp);
        } else if (elapsed < RAMP_SECONDS) {
          progressValue.current = ramp;
        } else {
          progressValue.current += (100 - progressValue.current) * 0.2;
          if (progressValue.current > 99.6) {
            progressValue.current = 100;
          }
        }
      } else {
        progressValue.current = 100;
      }

      const shown = Math.max(1, Math.round(progressValue.current));
      if (shown !== lastShown.current) {
        lastShown.current = shown;
        setProgress(shown);
      }

      const formation = Math.min(1, progressValue.current / 100);
      const centerX = width / 2;
      const centerY = height * 0.46;
      const monoWidth = Math.min(360, width * 0.7, height * 0.5);

      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        monoWidth * 1.4,
      );
      glow.addColorStop(0, "rgba(138,180,248,0.1)");
      glow.addColorStop(0.45, "rgba(255,255,255,0.025)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        const local = Math.max(
          0,
          Math.min(1, (formation - particle.delay) / (1 - particle.delay)),
        );
        const ease = 1 - Math.pow(1 - local, 3);
        const orbit = elapsed * 0.65 + particle.phase;
        const swirl = (1 - ease) * particle.swirl;
        const idle = ease * 0.9;
        const startX = particle.startNX * width;
        const startY = particle.startNY * height;
        const targetX = centerX + particle.targetNX * monoWidth;
        const targetY = centerY + particle.targetNY * monoWidth;

        const x =
          startX +
          (targetX - startX) * ease +
          Math.cos(orbit) * swirl +
          Math.cos(elapsed * 1.3 + particle.phase) * idle;
        const y =
          startY +
          (targetY - startY) * ease +
          Math.sin(orbit) * swirl +
          Math.sin(elapsed * 1.3 + particle.phase) * idle;

        const alpha = 0.14 + ease * 0.78;
        const pointSize = particle.size * (0.6 + ease * 0.5);

        context.fillStyle = particle.accent ? "#8ab4f8" : "#edf1f7";

        context.globalAlpha = alpha * 0.1;
        context.beginPath();
        context.arc(x, y, pointSize * 2.6, 0, Math.PI * 2);
        context.fill();

        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(x, y, pointSize, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";

      if (!reducedMotion) raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      applySize();
      if (reducedMotion) {
        progressValue.current = 100;
        draw(performance.now());
      }
    };
    window.addEventListener("resize", onResize);

    if (reducedMotion) {
      progressValue.current = 100;
      lastShown.current = 100;
      setProgress(100);
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      context.setTransform(1, 0, 0, 1, 0, 0);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[100] overflow-hidden bg-ink"
      role="status"
      aria-label="Loading portfolio"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />

      <div ref={cluster} className="absolute inset-0">
        <div className="absolute inset-x-0 top-[58%] flex flex-col items-center">
          <div className="w-[min(260px,72vw)]">
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
                className="h-px bg-paper transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading Yashraj Singh&apos;s portfolio</span>
    </div>
  );
}
