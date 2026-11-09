"use client";

import { smoothScrollTo } from "@/lib/animations/smoothScroll";

export default function ScrollIndicator({
  href = "#about",
  label = "Scroll to explore",
}: {
  href?: string;
  label?: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = window.innerWidth >= 768 ? 80 : 64;
    const targetY = Math.max(
      0,
      el.getBoundingClientRect().top + window.scrollY - headerOffset,
    );
    window.history.pushState(null, "", href);
    smoothScrollTo(targetY, 680);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={label}
      className="group flex items-center gap-4 text-muted transition-colors hover:text-paper"
    >
      <span className="relative h-16 w-px overflow-hidden bg-white/[0.15]">
        <span className="absolute left-0 top-0 h-5 w-px animate-[scrollLine_2.6s_ease-in-out_infinite] bg-accent" />
      </span>
      <span className="text-[0.58rem] font-medium uppercase tracking-label">
        Scroll
      </span>
    </a>
  );
}
