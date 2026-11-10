"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type LoadingScreenProps = {
  ready: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
};

type LoaderParticle = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  delay: number;
  phase: number;
  accent: boolean;
};

const CANVAS_SIZE = 260;
const PARTICLE_COUNT = 220;

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

    const duration = reducedMotion ? 0.01 : 0.9;
    const timeline = gsap.timeline({
      delay: 0.35,
      onComplete: () => onComplete(),
    });

    if (cluster.current) {
      timeline.to(
        cluster.current,
        {
          scale: reducedMotion ? 1 : 1.3,
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
        0.08,
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = CANVAS_SIZE;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    context.scale(dpr, dpr);

    const targets = buildMonogramTargets(size, PARTICLE_COUNT);
    const particles: LoaderParticle[] = targets.map((target) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 120 + Math.random() * 160;
      return {
        startX: size / 2 + Math.cos(angle) * radius * 1.2,
        startY: size / 2 + Math.sin(angle) * radius,
        targetX: target.x,
        targetY: target.y,
        size: 0.7 + Math.random() * 1.4,
        delay: Math.random() * 0.28,
        phase: Math.random() * Math.PI * 2,
        accent: Math.random() > 0.88,
      };
    });

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;

      if (!reducedMotion) {
        const natural =
          elapsed < 2.4
            ? 1 + 91 * (1 - Math.pow(1 - elapsed / 2.4, 3))
            : Math.min(98, 92 + (elapsed - 2.4) * 1.4);
        const target = readyValue.current ? 100 : natural;
        const rate = readyValue.current ? 0.11 : 0.07;

        progressValue.current += (target - progressValue.current) * rate;
        if (readyValue.current && progressValue.current > 99.4) {
          progressValue.current = 100;
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
      const globalEase = 1 - Math.pow(1 - formation, 3);
      const center = size / 2;

      context.clearRect(0, 0, size, size);

      const glow = context.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        118,
      );
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

      if (!reducedMotion) raf = requestAnimationFrame(draw);
    };

    if (reducedMotion) {
      progressValue.current = 100;
      lastShown.current = 100;
      setProgress(100);
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      context.setTransform(1, 0, 0, 1, 0, 0);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="flex flex-col items-center gap-8">
        <div ref={cluster} className="relative">
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
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
      </div>
      <span className="sr-only">Loading Yashraj Singh&apos;s portfolio</span>
    </div>
  );
}
