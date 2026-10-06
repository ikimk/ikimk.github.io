/**
 * Color — UI palette tokens by exact color name (ColorBlack, ColorCream…).
 * No role aliases (Bg / Text / Logo). Three.js → `threeJSColors.ts`.
 */

export const ColorBlack = '#000000';
export const ColorWhite = '#FFFFFF';
export const ColorCream = '#E8E2DB';
/** Logo glitch channels — Rockstar Games website logo hover SVG colors */
export const ColorGlitchBlue = '#418fa7';
export const ColorGlitchRed = '#dc3744';

/** CSS custom properties for SCSS / global styles (`layout.scss`) */
export const colorCssVars = {
  '--color-black': ColorBlack,
  '--color-white': ColorWhite,
  '--color-cream': ColorCream,
  '--color-glitch-blue': ColorGlitchBlue,
  '--color-glitch-red': ColorGlitchRed,
} as const;
