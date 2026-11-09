"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/data/education";
import { useReducedMotion } from "@/lib/useReducedMotion";
import EducationTimeline from "@/components/ui/EducationTimeline";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

export default function EducationScene() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".education-heading", {
        y: 30,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from("[data-education-item]", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".education-caption", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 45%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section
      id="education"
      ref={section}
      className="relative min-h-[150svh]"
      aria-labelledby="education-heading"
    >
      <div className="section-pad relative z-[2] flex min-h-[150svh] items-center py-32 md:py-40">
        <div className="grid w-full grid-cols-1 gap-14 md:grid-cols-[minmax(0,0.98fr)_minmax(0,0.82fr)] md:gap-12">
          <div>
            <SectionLabel index="02" className="education-heading">
              Education
            </SectionLabel>

            <h2
              id="education-heading"
              className="education-heading display mt-7 text-[clamp(2.4rem,5vw,5.2rem)] text-glow"
            >
              Academic
              <br />
              <span className="text-muted">foundation.</span>
            </h2>

            <p className="education-heading mt-6 max-w-md text-sm leading-relaxed text-muted">
              A record of the academic stages that shaped my work in computer
              science, artificial intelligence and machine learning.
            </p>

            <div className="mt-12 md:mt-16">
              <EducationTimeline entries={education} />

              <div className="education-caption mt-10 max-w-sm border-t border-white/[0.12] pt-5">
                <p className="text-[0.58rem] uppercase leading-relaxed tracking-label text-muted">
                  Institute of Engineering
                  <br />
                  and Management, Kolkata
                </p>
                <p className="mt-3 text-[0.55rem] uppercase tracking-label text-accent/80">
                  B.Tech / CSE AI
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:block" aria-hidden="true">
            <div className="relative h-full min-h-[520px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
