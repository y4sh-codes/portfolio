"use client";

import { ArrowUp } from "lucide-react";
import SocialLinks from "@/components/ui/SocialLinks";
import { social } from "@/data/social";
import { smoothScrollTo } from "@/lib/animations/smoothScroll";

export default function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    smoothScrollTo(0, 680);
  };

  return (
    <footer className="relative z-10 border-t border-white/[0.1] bg-ink">
      <div className="section-pad flex flex-col gap-8 py-10 md:py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="label">Designed &amp; developed by</p>
            <p className="mt-2 text-lg font-semibold uppercase tracking-[-0.02em] text-paper">
              Yashraj Singh
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <SocialLinks variant="icons" />
            <a
              href={`mailto:${social.email}`}
              className="link-underline text-sm text-muted"
            >
              {social.email}
            </a>
          </div>
        </div>

        <div className="hairline flex flex-col gap-4 pt-6 text-[0.6rem] uppercase tracking-label text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Yashraj Singh. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p className="hidden sm:block">India / IST</p>
            <button
              type="button"
              onClick={backToTop}
              className="group flex items-center gap-2 text-muted transition-colors hover:text-accent"
            >
              Back to top
              <ArrowUp
                size={13}
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
