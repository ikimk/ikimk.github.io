/**
 * Three.js color tokens — shaders / effects only.
 * UI palette lives in `src/utils/DesignSystem/color.ts` (do not mix).
 */

/** GradientCloud wash (deep → mid → light) */
export const ThreeColorWarmDeep = '#6a1c0a';
export const ThreeColorWarmMid = '#ff6a14';
export const ThreeColorWarmLight = '#ffe89c';

export const ThreeColorWarmGradient = [
  ThreeColorWarmDeep,
  ThreeColorWarmMid,
  ThreeColorWarmLight,
] as [string, string, string];
