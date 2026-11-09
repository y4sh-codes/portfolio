"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { social } from "@/data/social";
import { useReducedMotion } from "@/lib/useReducedMotion";
import SectionLabel from "@/components/ui/SectionLabel";
import SocialLinks from "@/components/ui/SocialLinks";

gsap.registerPlugin(ScrollTrigger);

export default function ContactScene() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".contact-reveal", {
        y: 30,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 68%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".contact-line", {
        yPercent: 120,
        duration: 1.35,
        stagger: 0.12,
        ease: "power4.out",
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
      id="contact"
      ref={section}
      className="relative min-h-[100svh]"
      aria-labelledby="contact-heading"
    >
      <div className="section-pad relative z-[2] flex min-h-[100svh] flex-col justify-between py-28 md:py-36">
        <div className="contact-reveal flex items-start justify-between">
          <SectionLabel index="05">Contact</SectionLabel>
          <p className="hidden text-[0.58rem] uppercase tracking-label text-muted md:block">
            Open to conversations
          </p>
        </div>

        <div className="py-16 md:py-20">
          <h2
            id="contact-heading"
            className="display text-[clamp(3rem,10vw,11rem)] text-glow"
          >
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="contact-line block">Let&apos;s</span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="contact-line block">
                Connect<span className="text-accent">.</span>
              </span>
            </span>
          </h2>

          <div className="contact-reveal mt-10 flex flex-col gap-6 border-t border-white/[0.12] pt-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label">Email</p>
              <a
                href={`mailto:${social.email}`}
                className="mt-3 inline-block text-[clamp(1rem,2.2vw,1.9rem)] font-medium tracking-[-0.02em] text-paper transition-colors duration-500 hover:text-accent"
              >
                {social.email}
              </a>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted md:text-right">
              Have an idea, a research question or a product to build? The
              inbox is open.
            </p>
          </div>
        </div>

        <div className="contact-reveal grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p className="label">Elsewhere</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Find the code, the experiments and the work in progress.
            </p>
          </div>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
