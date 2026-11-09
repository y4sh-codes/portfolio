"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

export default function IndiaScene() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".india-label", {
        opacity: 0,
        y: 14,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".india-line", {
        yPercent: 120,
        duration: 1.25,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 58%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".india-detail", {
        opacity: 0,
        duration: 0.9,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 58%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section
      id="india"
      ref={section}
      className="relative min-h-[125svh]"
      aria-labelledby="india-heading"
    >
      <div className="section-pad relative z-[2] flex min-h-[125svh] flex-col justify-between py-32 md:py-40">
        <div className="india-label flex items-start justify-between">
          <SectionLabel index="03">Location</SectionLabel>
          <p className="hidden text-[0.58rem] uppercase tracking-label text-muted md:block">
            India / IST
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="pointer-events-none h-[46vh] w-full md:h-[58vh]" aria-hidden="true" />
        </div>

        <div className="relative">
          <div className="india-detail absolute -top-10 right-0 hidden items-center gap-3 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <p className="text-[0.58rem] uppercase tracking-label text-muted">
              Kolkata / India
            </p>
          </div>

          <h2
            id="india-heading"
            className="display text-[clamp(2.9rem,8.6vw,9.4rem)] text-glow"
          >
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="india-line block">Based in</span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="india-line block text-muted">India</span>
            </span>
          </h2>

          <div className="india-detail mt-6 flex max-w-md items-start gap-5 border-t border-white/[0.12] pt-5">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted">
              A point cloud traced from the outline of India — the place where
              the work, the research and the next set of ideas begin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
