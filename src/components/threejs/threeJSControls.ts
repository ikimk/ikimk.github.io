/**
 * Three.js playground — all tunable defaults in one place.
 * Edit values here; the control panel in ThreeJSCanvas reads these.
 *
 * See Doc/threeJS/ThreeJSComponents.md for effect names.
 */

/** Scroll smoothing (host loop, not an effect) */
export const LerpEase = 0.07;
export const RecoverLerp = 0.05;

/** StarlightRibbon — bottom ribbon + its sun bloom */
export const STARLIGHT_DEFAULTS = {
  wavelength: 0.85,
  amplitude: 0.018,
  scrollIntensity: 0.9,
  curveWidth: 0.12,
  sunGlow: 0.6,
  sunScroll: 0.35,
  sunOpacity: 0.6,
  waveOffsetY: -5, // px — positive = up, negative = down
};

/** SunGlow — top edge only (no FilmGrain) */
export const SUNGLOW_DEFAULTS = {
  sunGlow: 0.6,
  sunScroll: 0.35,
  sunOpacity: 0.4,
};

/** FilmGrain — opt-in intensity (currently StarlightRibbon only) */
export const FILMGRAIN_DEFAULTS = {
  intensity: 0.18,
};

/**
 * Flat panel state for ThreeJSCanvas.
 * SunGlow keys are prefixed (*Top) so they never collide with StarlightRibbon.
 */
export const THREEJS_PANEL_DEFAULTS = {
  ...STARLIGHT_DEFAULTS,
  sunGlowTop: SUNGLOW_DEFAULTS.sunGlow,
  sunScrollTop: SUNGLOW_DEFAULTS.sunScroll,
  sunOpacityTop: SUNGLOW_DEFAULTS.sunOpacity,
  grainIntensity: FILMGRAIN_DEFAULTS.intensity,
};

export type ThreeJSPanelParams = typeof THREEJS_PANEL_DEFAULTS;
