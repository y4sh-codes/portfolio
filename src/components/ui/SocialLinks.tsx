"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { socialLinks } from "@/data/social";
import { cn } from "@/lib/utils";

const icons = {
  Email: Mail,
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
};

export default function SocialLinks({
  variant = "inline",
  className,
}: {
  variant?: "inline" | "icons";
  className?: string;
}) {
  if (variant === "icons") {
    return (
      <ul className={cn("flex items-center gap-2", className)}>
        {socialLinks.map((link) => {
          const Icon = icons[link.label as keyof typeof icons];
          return (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="flex h-10 w-10 items-center justify-center border border-white/[0.12] text-muted transition-colors duration-500 hover:border-accent/60 hover:text-accent"
              >
                <Icon size={15} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-0", className)}>
      {socialLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="group flex items-center justify-between border-b border-white/[0.1] py-4 transition-colors duration-500 hover:text-accent"
          >
            <span className="text-sm font-medium uppercase tracking-wide">
              {link.label}
            </span>
            <span className="flex items-center gap-3 text-muted transition-colors group-hover:text-accent">
              <span className="hidden text-[0.62rem] tracking-wide sm:block">
                {link.label === "Email" ? "Write" : "Open"}
              </span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
