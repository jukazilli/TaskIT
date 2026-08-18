export const breakpoints = {
  compact: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export type Breakpoint = keyof typeof breakpoints;
