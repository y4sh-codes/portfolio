"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { smoothScrollTo } from "@/lib/animations/smoothScroll";

const links = [
  { href: "#about", label: "About", id: "about" },
  { href: "#education", label: "Education", id: "education" },
  { href: "#india", label: "India", id: "india" },
  { href: "#projects", label: "Work", id: "projects" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;

      const headerOffset = window.innerWidth >= 768 ? 80 : 64;
      const targetY = Math.max(
        0,
        el.getBoundingClientRect().top +
          window.scrollY -
          (id === "hero" ? 0 : headerOffset),
      );

      setActive(id);
      window.history.pushState(null, "", href);
      smoothScrollTo(targetY, 680);
    },
    [],
  );

  return (
    <>
      <header
        className={cn(
          "nav-in fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? "border-b border-white/[0.08] bg-ink/70 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="section-pad flex h-16 items-center justify-between md:h-20">
          <Link
            href="#hero"
            onClick={(e) => scrollToSection(e, "#hero")}
            className="group flex items-center gap-3"
            aria-label="Yashraj Singh — back to top"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-white/20 text-[0.6rem] font-bold tracking-[0.12em] text-paper transition-colors duration-500 group-hover:border-accent/60 group-hover:text-accent">
              YS
            </span>
            <span className="hidden text-[0.62rem] font-medium uppercase tracking-label text-muted transition-colors duration-500 group-hover:text-paper sm:block">
              Yashraj Singh
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={cn(
                  "relative text-[0.62rem] font-medium uppercase tracking-label transition-colors duration-500 hover:text-paper",
                  active === link.id ? "text-paper" : "text-muted",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-px w-full origin-left bg-accent transition-transform duration-500",
                    active === link.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="hidden items-center gap-2 border border-white/[0.15] px-4 py-2 text-[0.6rem] font-medium uppercase tracking-label text-paper transition-colors duration-500 hover:border-accent/60 hover:text-accent sm:flex"
            >
              Let&apos;s talk
              <span aria-hidden="true">↗</span>
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-white/[0.15] text-paper transition-colors hover:border-accent/60 hover:text-accent md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl transition-[opacity,visibility] duration-500 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav
          className="flex h-full flex-col justify-center gap-2 px-8"
          aria-label="Mobile"
        >
          {links.map((link, index) => (
            <Link
              key={link.href}
              ref={index === 0 ? firstLink : undefined}
              href={link.href}
              onClick={(e) => {
                setOpen(false);
                scrollToSection(e, link.href);
              }}
              className="group flex items-baseline gap-4 border-b border-white/[0.08] py-4"
            >
              <span className="label text-accent">0{index + 1}</span>
              <span className="text-4xl font-bold uppercase tracking-[-0.04em] text-paper transition-colors group-hover:text-accent">
                {link.label}
              </span>
            </Link>
          ))}
          <p className="label mt-10">India / IST</p>
        </nav>
      </div>
    </>
  );
}
