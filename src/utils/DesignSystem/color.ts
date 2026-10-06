/**
 * Color — UI palette tokens by exact color name (ColorBlack, ColorCream…).
 * No role aliases (Bg / Text / Logo). Three.js → `threeJSColors.ts`.
 */

/** Blacks — dark → less dark */
export const ColorBlackDarkest = '#010703';
export const ColorBlack = '#0A0A0A';
export const ColorGrayBlack = '#1B1B1B';

/** Action */
export const ColorOrange = '#FF5320';
export const ColorBlue = '#00A1DC';
export const ColorGreen = '#00B327';

/** Whites — light → dark */
export const ColorWhite = '#F0F0EF';
export const ColorCream = '#E8E2DB';
export const ColorAsh = '#CCC7C6';
export const ColorPearl = '#C7C7CF';
export const ColorGray = '#BBBBBB';

/** Logo glitch channels — Rockstar Games website logo hover SVG colors */
export const ColorGlitchBlue = '#418fa7';
export const ColorGlitchRed = '#dc3744';

/** CSS custom properties for SCSS / global styles (`layout.scss`) */
export const colorCssVars = {
  '--color-black-darkest': ColorBlackDarkest,
  '--color-black': ColorBlack,
  '--color-gray-black': ColorGrayBlack,
  '--color-orange': ColorOrange,
  '--color-blue': ColorBlue,
  '--color-green': ColorGreen,
  '--color-white': ColorWhite,
  '--color-cream': ColorCream,
  '--color-ash': ColorAsh,
  '--color-pearl': ColorPearl,
  '--color-gray': ColorGray,
  '--color-glitch-blue': ColorGlitchBlue,
  '--color-glitch-red': ColorGlitchRed,
} as const;
