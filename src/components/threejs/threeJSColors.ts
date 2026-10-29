/**
 * Three.js color tokens — shaders / effects only.
 * UI palette lives in `src/utils/DesignSystem/color.ts` (do not mix).
 */

import {
  ColorAmber,
  ColorBlackDarkest,
  ColorLightBlue,
  ColorOrange,
  ColorRed,
  ColorYellow,
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

/** RedSunriseGlassEffect — DesignSystem colors only (no new hex) */
export const ThreeColorRedSunriseRed = ColorRed;
export const ThreeColorRedSunriseOrange = ColorOrange;
export const ThreeColorRedSunriseYellow = ColorYellow;
export const ThreeColorRedSunriseLightBlue = ColorLightBlue;

/**
 * PinkSunriseGlassEffect — pink / orange sunrise gradient (sun at bottom).
 * Sampled from the reference image — out of design system color (do not use in UI).
 */
/** out of design system color — sun core (peach / yellow-orange) */
export const ThreeColorPinkSunriseCore = '#FFB86B';
/** out of design system color — warm orange */
export const ThreeColorPinkSunriseOrange = '#FF8F5E';
/** out of design system color — coral red */
export const ThreeColorPinkSunriseCoral = '#F9667A';
/** out of design system color — magenta pink */
export const ThreeColorPinkSunrisePink = '#D96AAE';
/** out of design system color — soft lavender */
export const ThreeColorPinkSunriseLavender = '#B7A7EC';
/** out of design system color — pale mist / near white */
export const ThreeColorPinkSunriseMist = '#F3F0FF';
