export const social = {
  email: "yashrajsingh231105@gmail.com",
  github: "https://github.com/y4sh-codes",
  linkedin: "https://www.linkedin.com/in/y4sh-codes",
  x: "https://x.com/y4sh_codes",
} as const;

export type SocialLink = {
  label: string;
  href: string;
  external: boolean;
};

export const socialLinks: SocialLink[] = [
  { label: "Email", href: `mailto:${social.email}`, external: false },
  { label: "GitHub", href: social.github, external: true },
  { label: "LinkedIn", href: social.linkedin, external: true },
  { label: "X", href: social.x, external: true },
];
