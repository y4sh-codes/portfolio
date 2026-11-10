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

      const sectionElement = section.current;
      const trackElement = track.current;
      const progressElement = progress.current;
      const media = gsap.matchMedia();

      media.add("(min-width: 1180px)", () => {
        const distance = () => {
          return Math.max(
            0,
            trackElement.scrollWidth -
              window.innerWidth +
              window.innerWidth * 0.08,
          );
        };

        gsap.to(trackElement, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });

        if (progressElement) {
          gsap.fromTo(
            progressElement,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionElement,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
              },
            },
          );
        }
      });

      return () => media.revert();
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
                Projects<span className="text-muted">.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              A selection spanning multimodal AI, decentralised
              infrastructure, ocean data and diffusion-model research.
            </p>
          </div>

          <div className="mt-14 hidden gap-6 desktop:grid desktop:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                layout="vertical"
              />
            ))}
          </div>

          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden pb-6 desktop:hidden">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
      className="relative desktop:h-[420vh]"
      aria-labelledby="projects-heading"
    >
      <div className="flex flex-col pb-16 desktop:sticky desktop:top-0 desktop:h-[100svh] desktop:overflow-hidden desktop:pb-0">
        <div className="section-pad relative z-20 flex items-start justify-between pt-24 md:pt-28">
          <div>
            <SectionLabel index="04">Selected work</SectionLabel>
            <h2
              id="projects-heading"
              className="mt-4 text-[clamp(1.6rem,2.6vw,2.6rem)] font-semibold uppercase tracking-[-0.03em] text-paper"
            >
              Projects<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="hidden text-right desktop:block">
            <p className="label">Scroll to explore</p>
            <p className="mt-2 text-[0.58rem] uppercase tracking-label text-muted">
              Vertical scroll / horizontal motion
            </p>
          </div>
          <div className="text-right desktop:hidden">
            <p className="label">Swipe to explore</p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center desktop:overflow-hidden">
          <div
            ref={track}
            className="no-scrollbar flex w-full snap-x snap-mandatory items-center gap-5 overflow-x-auto overflow-y-hidden scroll-pl-[6vw] px-[6vw] py-6 will-change-transform desktop:w-max desktop:snap-none desktop:overflow-visible desktop:gap-7 desktop:px-0 desktop:pb-0 desktop:pl-[6vw] desktop:pr-[8vw] desktop:py-0"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="section-pad relative z-20 hidden items-center gap-6 pb-8 desktop:flex">
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
