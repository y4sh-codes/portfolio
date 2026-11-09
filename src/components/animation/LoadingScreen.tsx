"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type LoadingScreenProps = {
  ready: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
};

type LoaderParticle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
};

export default function LoadingScreen({
  ready,
  reducedMotion,
  onComplete,
}: LoadingScreenProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const cluster = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const completed = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(ready ? 100 : 68));
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  useEffect(() => {
    if (ready) setProgress(100);
  }, [ready]);

  useEffect(() => {
    if (!ready || completed.current) return;
    completed.current = true;

    const duration = reducedMotion ? 0.01 : 0.9;
    const timeline = gsap.timeline({
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
  }, [ready, reducedMotion, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    context.scale(dpr, dpr);

    const particles: LoaderParticle[] = Array.from({ length: 96 }, (_, i) => ({
      angle: (i / 96) * Math.PI * 2 + Math.random() * 0.7,
      radius: 18 + Math.random() * 68,
      speed: 0.12 + Math.random() * 0.35,
      size: 0.7 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      context.clearRect(0, 0, size, size);
      const center = size / 2;

      const glow = context.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        90,
      );
      glow.addColorStop(0, "rgba(138,180,248,0.11)");
      glow.addColorStop(0.45, "rgba(255,255,255,0.035)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, size, size);

      for (const particle of particles) {
        const convergence = reducedMotion
          ? 1
          : 0.72 + Math.sin(t * 0.55 + particle.phase) * 0.28;
        const radius = particle.radius * convergence;
        const angle = particle.angle + t * particle.speed;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius * 0.72;
        const alpha = 0.25 + (1 - radius / 92) * 0.65;

        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${Math.max(0.08, alpha)})`;
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.beginPath();
      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 1;
      context.arc(center, center, 34, 0, Math.PI * 2);
      context.stroke();

      if (!reducedMotion) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
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
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.55)]" />
          </div>
        </div>
        <div className="w-28">
          <div className="h-px w-full bg-white/10">
            <div
              className="h-px bg-paper transition-[width] duration-[900ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading Yashraj Singh&apos;s portfolio</span>
    </div>
  );
}
