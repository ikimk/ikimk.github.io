/**
 * Three.js color tokens — shaders / effects only.
 * UI palette lives in `src/utils/DesignSystem/color.ts` (do not mix).
 */

import {
  ColorAmber,
  ColorBlackDarkest,
  ColorRed,
} from '@/utils/DesignSystem';

/** GradientCloud wash (deep → mid → light) */
export const ThreeColorWarmDeep = '#6a1c0a';
export const ThreeColorWarmMid = '#ff6a14';
export const ThreeColorWarmLight = '#ffe89c';

export const ThreeColorWarmGradient = [
  ThreeColorWarmDeep,
  ThreeColorWarmMid,
  ThreeColorWarmLight,
] as [string, string, string];

/** PSGrid — amber glyphs (homepage); plane is transparent — page bg shows through */
export const ThreeColorPSGridGlyph = ColorAmber;
/** PSGrid — 404 / error pages */
export const ThreeColorPSGridGlyphError = ColorRed;

/** Starlight bottom dark→light blend veil (matches page bg) */
export const ThreeColorStarlightBlend = ColorBlackDarkest;
