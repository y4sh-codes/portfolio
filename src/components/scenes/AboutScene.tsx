"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/lib/useReducedMotion";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

export default function AboutScene() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".about-reveal", {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".about-tag", {
        y: 12,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section
      id="about"
      ref={section}
      className="relative min-h-[132svh]"
      aria-labelledby="about-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.94),rgba(8,9,11,0.84)_40%,rgba(8,9,11,0.94))] md:bg-[linear-gradient(90deg,rgba(8,9,11,0.9),rgba(8,9,11,0.55)_45%,rgba(8,9,11,0.2)_70%,rgba(8,9,11,0.55))]" />

      <div className="section-pad relative z-[2] flex min-h-[132svh] items-center py-32 md:py-40">
        <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-[minmax(0,0.95fr)_minmax(0,0.85fr)] md:gap-10">
          <div className="max-w-xl">
            <SectionLabel index="01" className="about-reveal">
              About
            </SectionLabel>

            <h2
              id="about-heading"
              className="about-reveal display mt-7 text-[clamp(2.5rem,5.2vw,5.4rem)] text-glow"
            >
              A practice in
              <br />
              <span className="text-muted">intelligence.</span>
            </h2>

            <div className="mt-10 space-y-5 md:mt-12">
              {portfolio.about.map((paragraph, index) => (
                <p
                  key={index}
                  className={`about-reveal max-w-lg text-[0.95rem] leading-[1.85] md:text-[1.02rem] ${
                    index === 0 ? "text-paper/90" : "text-muted"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2 md:mt-12">
              {portfolio.keywords.map((keyword) => (
                <span key={keyword} className="about-tag tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden md:block" aria-hidden="true">
            <div className="relative h-full min-h-[420px]">
              <div className="absolute bottom-6 right-0 flex items-center gap-4">
                <span className="h-px w-10 bg-white/20" />
                <p className="text-right text-[0.58rem] uppercase leading-relaxed tracking-label text-muted">
                  Portrait study
                  <br />
                  Particle field / 01
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-4 text-[0.55rem] uppercase tracking-label text-muted md:flex">
        <span className="h-px w-12 bg-white/[0.15]" />
        <span>AI / ML Engineer</span>
        <span className="h-px w-12 bg-white/[0.15]" />
      </div>
    </section>
  );
}
