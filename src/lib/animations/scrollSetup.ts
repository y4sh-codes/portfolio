import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceState } from "./experienceState";

let registered = false;

function ensurePlugins() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
}

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function setBaseScene() {
  experienceState.stage = 1;
  experienceState.opacity = 1;
  experienceState.turbulence = 1;
  experienceState.groupX = 0;
  experienceState.groupY = 0;
  experienceState.groupScale = 1;
}

/**
 * The master scroll map. It writes directly into the mutable experience
 * state; no React state is updated during scroll. The WebGL field damps
 * toward these values every frame, which keeps scrubbing smooth and
 * naturally reversible.
 */
export function setupScrollExperience() {
  ensurePlugins();

  const ctx = gsap.context(() => {
    const mobile = isMobileViewport();

    const hero = document.querySelector<HTMLElement>("#hero");
    const about = document.querySelector<HTMLElement>("#about");
    const education = document.querySelector<HTMLElement>("#education");
    const india = document.querySelector<HTMLElement>("#india");
    const projects = document.querySelector<HTMLElement>("#projects");
    const contact = document.querySelector<HTMLElement>("#contact");

    if (!hero || !about || !education || !india || !projects || !contact) {
      return;
    }

    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.progress < 0.18) {
          experienceState.stage = 1;
          experienceState.opacity = 1;
          experienceState.groupX = 0;
          experienceState.groupScale = 1;
          experienceState.turbulence = 1;
        }
      },
    });

    ScrollTrigger.create({
      trigger: about,
      start: "top 92%",
      end: "top 28%",
      onUpdate: (self) => {
        const p = self.progress;
        experienceState.stage = 1;
        experienceState.opacity = 1 - p * 0.12;
        experienceState.groupX = p * (mobile ? 0.09 : 0.21);
        experienceState.groupY = p * (mobile ? 0.02 : 0.015);
        experienceState.groupScale = 1 - p * (mobile ? 0.06 : 0.1);
        experienceState.turbulence = 1 - p * 0.25;
      },
      onLeaveBack: () => {
        setBaseScene();
      },
    });

    ScrollTrigger.create({
      trigger: education,
      start: "top 78%",
      end: "top 18%",
      onUpdate: (self) => {
        const p = self.progress;
        experienceState.stage = 1 + p;
        experienceState.opacity = 0.92;
        experienceState.groupX =
          (mobile ? 0.09 : 0.21) * (1 - p) + p * (mobile ? 0.05 : 0.2);
        experienceState.groupY = 0.015 * (1 - p);
        experienceState.groupScale = 0.88 + p * 0.05;
        experienceState.turbulence = 0.75 + p * 0.1;
      },
      onLeave: () => {
        experienceState.stage = 2;
        experienceState.opacity = 0.95;
        experienceState.groupX = mobile ? 0.05 : 0.2;
        experienceState.groupY = 0;
        experienceState.groupScale = 0.93;
        experienceState.turbulence = 0.85;
      },
      onLeaveBack: () => {
        setBaseScene();
      },
    });

    ScrollTrigger.create({
      trigger: india,
      start: "top 78%",
      end: "top 18%",
      onUpdate: (self) => {
        const p = self.progress;
        experienceState.stage = 2 + p;
        experienceState.opacity = 0.95;
        experienceState.groupX = (mobile ? 0.07 : 0.17) * (1 - p);
        experienceState.groupY = 0;
        experienceState.groupScale = 0.98 + p * 0.05;
        experienceState.turbulence = 0.8 - p * 0.2;
      },
      onLeave: () => {
        experienceState.stage = 3;
        experienceState.opacity = 1;
        experienceState.groupX = 0;
        experienceState.groupScale = 1.03;
        experienceState.turbulence = 0.6;
      },
      onLeaveBack: () => {
        experienceState.stage = 2;
        experienceState.opacity = 0.95;
        experienceState.groupX = mobile ? 0.05 : 0.2;
        experienceState.groupScale = 0.93;
        experienceState.turbulence = 0.85;
      },
    });

    ScrollTrigger.create({
      trigger: projects,
      start: "top 82%",
      end: "top 30%",
      onUpdate: (self) => {
        const p = self.progress;
        experienceState.stage = 3 + p;
        experienceState.opacity = 1 - p * 0.66;
        experienceState.groupX = 0;
        experienceState.groupY = 0;
        experienceState.groupScale = 1.03 + p * 0.12;
        experienceState.turbulence = 0.6 + p * 1.25;
      },
      onLeave: () => {
        experienceState.stage = 4;
        experienceState.opacity = 0.32;
        experienceState.groupX = 0;
        experienceState.groupScale = 1.15;
        experienceState.turbulence = 1.85;
      },
      onLeaveBack: () => {
        experienceState.stage = 3;
        experienceState.opacity = 1;
        experienceState.groupX = 0;
        experienceState.groupScale = 1.03;
        experienceState.turbulence = 0.6;
      },
    });

    ScrollTrigger.create({
      trigger: contact,
      start: "top 85%",
      end: "top 35%",
      onUpdate: (self) => {
        const p = self.progress;
        experienceState.stage = 4;
        experienceState.opacity = 0.22 + p * 0.1;
        experienceState.turbulence = 1.85 - p * 0.5;
        experienceState.groupScale = 1.15;
      },
      onLeaveBack: () => {
        experienceState.stage = 4;
        experienceState.opacity = 0.22;
        experienceState.turbulence = 1.85;
      },
    });

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        experienceState.scrollProgress = self.progress;
      },
    });

    // When a visitor reloads halfway down the page, put the particle field
    // in the correct scene instead of waiting for the first scroll event.
    if (window.scrollY > 12) {
      const viewport = window.innerHeight;
      const near = (element: HTMLElement) =>
        element.getBoundingClientRect().top < viewport * 0.55;

      if (near(contact) || near(projects)) {
        experienceState.stage = 4;
        experienceState.opacity = 0.24;
        experienceState.turbulence = 1.8;
        experienceState.groupScale = 1.15;
      } else if (near(india)) {
        experienceState.stage = 3;
        experienceState.opacity = 1;
        experienceState.turbulence = 0.6;
        experienceState.groupScale = 1.03;
      } else if (near(education)) {
        experienceState.stage = 2;
        experienceState.opacity = 0.95;
        experienceState.turbulence = 0.85;
        experienceState.groupX = mobile ? 0.05 : 0.2;
        experienceState.groupScale = 0.93;
      } else if (near(about)) {
        experienceState.stage = 1;
        experienceState.opacity = 0.9;
        experienceState.turbulence = 0.8;
        experienceState.groupX = mobile ? 0.09 : 0.21;
        experienceState.groupScale = 0.9;
      }
    }
  });

  ScrollTrigger.refresh();

  return () => {
    ctx.revert();
  };
}
