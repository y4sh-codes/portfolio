"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Github, Minus, Plus } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectPreview from "./ProjectPreview";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
  layout = "horizontal",
}: {
  project: Project;
  layout?: "horizontal" | "vertical";
}) {
  const [open, setOpen] = useState(false);
  const descriptionId = useId();

  return (
    <article
      data-project-card
      className={cn(
        "group relative flex shrink-0 flex-col overflow-hidden border border-white/[0.12] bg-carbon/40 transition-colors duration-700 hover:border-accent/[0.35] hover:bg-carbon/60",
        layout === "horizontal"
          ? "h-[62vh] w-[82vw] sm:w-[68vw] md:h-[66vh] md:w-[46vw] lg:w-[39vw] xl:w-[35vw]"
          : "h-auto w-full",
      )}
      aria-labelledby={`project-${project.id}-title`}
    >
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-pointer"
        aria-expanded={open}
        aria-controls={descriptionId}
        aria-label={`${open ? "Hide" : "Show"} details for ${project.name}`}
        onClick={() => setOpen((value) => !value)}
      />

      <div
        className={cn(
          "pointer-events-none relative z-10 overflow-hidden border-b border-white/[0.1]",
          layout === "horizontal" ? "h-[54%]" : "h-[46vh]",
        )}
      >
        <ProjectPreview variant={project.visual} />
      </div>

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col justify-between p-5 md:p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                id={`project-${project.id}-title`}
                className="text-2xl font-semibold uppercase tracking-[-0.03em] text-paper md:text-3xl"
              >
                {project.name}
              </h3>
              <p className="mt-1 text-[0.62rem] uppercase tracking-wide text-accent/90">
                {project.tagline}
              </p>
            </div>
            <span
              className="mt-1 flex shrink-0 items-center gap-2"
              aria-hidden="true"
            >
              <span className="text-[0.6rem] font-semibold tracking-label text-muted">
                {project.index}
              </span>
              <span className="flex h-6 w-6 items-center justify-center border border-white/[0.12] text-accent/85">
                {open ? <Minus size={12} /> : <Plus size={12} />}
              </span>
            </span>
          </div>

          <div
            id={descriptionId}
            aria-hidden={!open}
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-500 ease-cinematic",
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <p className="mt-3 max-w-md text-[0.82rem] leading-relaxed text-muted">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-5 border-t border-white/[0.1] pt-4">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline pointer-events-auto text-[0.65rem] uppercase tracking-wide"
            >
              <Github size={13} aria-hidden="true" />
              Repository
            </a>
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline pointer-events-auto text-[0.65rem] uppercase tracking-wide"
              >
                <ArrowUpRight size={13} aria-hidden="true" />
                Live demo
              </a>
            ) : (
              <span className="text-[0.6rem] uppercase tracking-wide text-muted/60">
                Research project
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
