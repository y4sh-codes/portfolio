"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperienceReady } from "@/components/animation/ExperienceContext";
import { useReducedMotion } from "@/lib/useReducedMotion";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene() {
  const section = useRef<HTMLElement>(null);
  const ready = useExperienceReady();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ready) return;

      if (reduced) {
        gsap.set(".hero-copy, .hero-scroll, .hero-rule", {
          opacity: 1,
          y: 0,
          scaleX: 1,
        });
        gsap.set(".hero-line", { yPercent: 0 });
        return;
      }

      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .from(".hero-line", {
          yPercent: 118,
          duration: 1.25,
          stagger: 0.11,
          ease: "power4.out",
        })
        .from(
          ".hero-copy",
          {
            opacity: 0,
            y: 18,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.25,
        )
        .from(
          ".hero-rule",
          { scaleX: 0, duration: 0.9, ease: "power3.out" },
          0.7,
        )
        .from(
          ".hero-scroll",
          { opacity: 0, y: 10, duration: 0.8, ease: "power2.out" },
          0.9,
        );

      const scroll = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      scroll
        .to(".hero-copy", { y: -70, opacity: 0, ease: "none" }, 0)
        .to(".hero-scroll", { opacity: 0, ease: "none" }, 0)
        .to(".hero-rule", { scaleX: 0, opacity: 0, ease: "none" }, 0);
    },
    { scope: section, dependencies: [ready, reduced] },
  );

  return (
    <section
      id="hero"
      ref={section}
      className="relative h-[135svh]"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(8,9,11,0.45)_0%,transparent_24%,rgba(8,9,11,0.72)_46%,rgba(8,9,11,0.97)_64%,rgba(8,9,11,0.99)_100%)] md:bg-[linear-gradient(90deg,rgba(8,9,11,0.7),transparent_32%,transparent_68%,rgba(8,9,11,0.7))]" />

      <div className="section-pad sticky top-0 z-[2] flex h-[100svh] flex-col justify-between pb-8 pt-24 md:pb-10 md:pt-28">
        <div className="flex items-start justify-between">
          <SectionLabel index="00">Introduction</SectionLabel>
          <p className="hidden text-[0.58rem] uppercase tracking-label text-muted md:block">
            India / IST
          </p>
        </div>

        <div className="flex flex-1 items-end pb-6 md:items-center md:pb-0">
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(160px,0.8fr)_minmax(0,1fr)] md:items-center md:gap-8">
            <div className="hero-copy order-2 md:order-1">
              <p className="label-accent">Portfolio / 2026</p>
              <h1 className="display mt-4 text-[clamp(3rem,6.3vw,7.3rem)] text-glow">
                <span className="block overflow-hidden pb-[0.06em]">
                  <span className="hero-line block">Yashraj</span>
                </span>
                <span className="block overflow-hidden pb-[0.06em]">
                  <span className="hero-line block">Singh</span>
                </span>
              </h1>
              <div className="hero-rule mt-6 h-px w-24 origin-left bg-accent/60" />
              <p className="hero-copy mt-5 max-w-xs text-sm leading-relaxed text-muted">
                Computer Science student specialising in Artificial
                Intelligence and Machine Learning.
              </p>
            </div>

            <div className="order-1 hidden h-[34vh] md:block" aria-hidden="true" />

            <div className="hero-copy order-3 text-left md:text-right">
              <p className="label">Focus</p>
              <p className="mt-3 text-[clamp(1.45rem,3.1vw,3.4rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em] text-paper">
                AI
                <br />
                Engineer
              </p>
              <p className="mt-5 max-w-[15rem] text-xs leading-relaxed text-muted md:ml-auto">
                Building intelligent systems, research experiments and
                practical software products.
              </p>
              <p className="mt-5 hidden text-[0.58rem] uppercase tracking-label text-muted/80 md:block">
                CSE AI
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="hero-scroll">
            <ScrollIndicator href="#about" />
          </div>
          <p className="hidden text-[0.58rem] uppercase tracking-label text-muted md:block">
            Portrait reconstructed from particles
          </p>
        </div>
      </div>
    </section>
  );
}
