export const isPlatformBrowser = typeof window === "object";
export const isPlatformServer = !isPlatformBrowser;
export const prefersReducedMotion =
  isPlatformBrowser &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
