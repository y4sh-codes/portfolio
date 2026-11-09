export type DeviceProfile = {
  particleCount: number;
  dpr: [number, number];
  isMobile: boolean;
  isTablet: boolean;
  reducedMotion: boolean;
  webgl: boolean;
};

export function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function getDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") {
    return {
      particleCount: 12000,
      dpr: [1, 1.6],
      isMobile: false,
      isTablet: false,
      reducedMotion: false,
      webgl: true,
    };
  }

  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1180;
  const cores =
    typeof navigator !== "undefined" && "hardwareConcurrency" in navigator
      ? navigator.hardwareConcurrency
      : 8;
  const memory =
    typeof navigator !== "undefined" && "deviceMemory" in navigator
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
      : 8;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let particleCount = 20000;
  if (isTablet) particleCount = 12000;
  if (isMobile) particleCount = 5000;
  if (cores <= 4 || memory <= 4) particleCount = Math.round(particleCount * 0.72);
  if (reducedMotion) particleCount = Math.round(particleCount * 0.75);

  return {
    particleCount: Math.max(2800, particleCount),
    dpr: isMobile ? [1, 1.5] : [1, 1.75],
    isMobile,
    isTablet,
    reducedMotion,
    webgl: supportsWebGL(),
  };
}
