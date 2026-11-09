import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08090B",
        carbon: "#101216",
        paper: "#F5F5F5",
        muted: "#92969E",
        accent: "#8AB4F8",
        highlight: "#DCE7F5",
        line: "rgba(255,255,255,0.12)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.28em",
        wide: "0.16em",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-8px,0)" },
        },
        scan: {
          "0%": { transform: "translateY(-110%)" },
          "100%": { transform: "translateY(110%)" },
        },
        dash: {
          to: { strokeDashoffset: "-24" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        scan: "scan 7s linear infinite",
        dash: "dash 2.4s linear infinite",
        "pulse-soft": "pulseSoft 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
