export type ExperienceState = {
  /** 0 = scattered field, 1 = portrait, 2 = building, 3 = India, 4 = ambient */
  stage: number;
  opacity: number;
  turbulence: number;
  /** Fraction of the viewport width. */
  groupX: number;
  /** Fraction of the viewport height. */
  groupY: number;
  groupScale: number;
  scrollProgress: number;
  pointerX: number;
  pointerY: number;
  reduced: boolean;
};

export const experienceState: ExperienceState = {
  stage: 0,
  opacity: 0,
  turbulence: 1.2,
  groupX: 0,
  groupY: 0,
  groupScale: 1,
  scrollProgress: 0,
  pointerX: 0,
  pointerY: 0,
  reduced: false,
};

export function resetExperienceState() {
  experienceState.stage = 0;
  experienceState.opacity = 0;
  experienceState.turbulence = 1.2;
  experienceState.groupX = 0;
  experienceState.groupY = 0;
  experienceState.groupScale = 1;
  experienceState.scrollProgress = 0;
  experienceState.pointerX = 0;
  experienceState.pointerY = 0;
}
