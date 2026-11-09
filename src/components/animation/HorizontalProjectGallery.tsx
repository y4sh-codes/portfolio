"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalProjectGallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !section.current || !track.current) return;

      const distance = () => {
        const element = track.current;
        if (!element) return 0;
        return Math.max(
          0,
          element.scrollWidth - window.innerWidth + window.innerWidth * 0.08,
        );
      };

      gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      if (progress.current) {
        gsap.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
            },
          },
        );
      }
    },
    { scope: section, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <section
        id="projects"
        ref={section}
        className="relative"
        aria-labelledby="projects-heading"
      >
        <div className="section-pad py-28 md:py-36">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="04">Selected work</SectionLabel>
              <h2
                id="projects-heading"
                className="display mt-6 text-[clamp(2.4rem,5vw,5.2rem)] text-glow"
              >
                Selected
                <br />
                <span className="text-muted">projects.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Four projects spanning multimodal AI, decentralised
              infrastructure, ocean data and diffusion-model research.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                layout="vertical"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={section}
      className="relative h-[420vh] md:h-[460vh]"
      aria-labelledby="projects-heading"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="section-pad relative z-20 flex items-start justify-between pt-24 md:pt-28">
          <div>
            <SectionLabel index="04">Selected work</SectionLabel>
            <h2
              id="projects-heading"
              className="mt-4 text-[clamp(1.6rem,2.6vw,2.6rem)] font-semibold uppercase tracking-[-0.03em] text-paper"
            >
              Four projects<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <p className="label">Scroll to explore</p>
            <p className="mt-2 text-[0.58rem] uppercase tracking-label text-muted">
              Vertical scroll / horizontal motion
            </p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center overflow-hidden">
          <div
            ref={track}
            className="flex h-full w-max items-center gap-5 pl-[6vw] pr-[8vw] will-change-transform md:gap-7"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="section-pad relative z-20 flex items-center gap-6 pb-8">
          <span className="text-[0.58rem] uppercase tracking-label text-muted">
            01
          </span>
          <span className="relative h-px flex-1 bg-white/[0.12]">
            <span
              ref={progress}
              className="absolute inset-0 origin-left bg-accent/80"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="text-[0.58rem] uppercase tracking-label text-muted">
            04
          </span>
        </div>
      </div>
    </section>
  );
}
