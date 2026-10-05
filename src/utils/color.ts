/**
 * Color — UI palette tokens by exact color name (ColorBlack, ColorCream…).
 * No role aliases (Bg / Text / Logo). Three.js → `threeJSColors.ts`.
 */

export const ColorBlack = '#000000';
export const ColorWhite = '#FFFFFF';
export const ColorCream = '#E8E2DB';

/** CSS custom properties for SCSS / global styles (`layout.scss`) */
export const colorCssVars = {
  '--color-black': ColorBlack,
  '--color-white': ColorWhite,
  '--color-cream': ColorCream,
} as const;
