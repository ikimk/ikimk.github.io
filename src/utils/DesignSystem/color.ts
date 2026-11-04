/**
 * Color — UI palette tokens by exact color name (ColorBlack, ColorCream…).
 * No role aliases (Bg / Text / Logo). Three.js → `threeJSColors.ts`.
 */

import type { CSSProperties } from 'react';

/** Blacks — dark → less dark */
export const ColorBlackDarkest = '#010703';
export const ColorBlack = '#0A0A0A';
export const ColorGrayBlack = '#1B1B1B';

/** Action / spectrum */
export const ColorRed = '#FF0000';
export const ColorOrange = '#FF5320';
export const ColorAmber = '#FF9500';
export const ColorYellow = '#FFC53A';
export const ColorBlue = '#00A1DC';
/** Soft powder blue — sky / mist edges */
export const ColorLightBlue = '#A8D4F0';
export const ColorGreen = '#00B327';

/** Whites — light → dark */
export const ColorWhite = '#F0F0EF';
export const ColorCream = '#E8E2DB';
export const ColorStone = '#CCC7C6';
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
  '--color-red': ColorRed,
  '--color-orange': ColorOrange,
  '--color-amber': ColorAmber,
  '--color-yellow': ColorYellow,
  '--color-blue': ColorBlue,
  '--color-light-blue': ColorLightBlue,
  '--color-green': ColorGreen,
  '--color-white': ColorWhite,
  '--color-cream': ColorCream,
  '--color-stone': ColorStone,
  '--color-pearl': ColorPearl,
  '--color-gray': ColorGray,
  '--color-glitch-blue': ColorGlitchBlue,
  '--color-glitch-red': ColorGlitchRed,
} as CSSProperties;
