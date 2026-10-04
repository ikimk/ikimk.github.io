/**
 * Three.js playground — all tunable defaults in one place.
 * Edit values here; the control panel in ThreeJSCanvas reads these.
 * Names match panel labels (snake_case).
 *
 * See Doc/threeJS/ThreeJSComponents.md for effect names.
 */

/** Scroll smoothing (host loop, not an effect) */
export const LerpEase = 0.07;
export const RecoverLerp = 0.05;

/** StarlightRibbon — bottom ribbon + its sun bloom */
export const STARLIGHT_DEFAULTS = {
  wave_offset_y: -5, // px — positive = up, negative = down
  wavelength: 0.85,
  amplitude: 0.018,
  scroll_intensity: 0.9,
  curve_width: 0.12,
  ribbon_sun_glow: 0.6,
  ribbon_sun_on_scroll: 0.35,
  ribbon_sun_opacity: 0.6,
  /** Starlight FilmGrain — animates between these (Starlight only) */
  grain_intensity: 0.13,
  grain_intensity_to: 0.31,
};

/** SunGlow — top edge only (no FilmGrain) */
export const SUNGLOW_DEFAULTS = {
  sun_glow: 0.6,
  sun_glow_on_scroll: 0.35,
  sun_opacity: 0.4,
};

/** FilmGrain — StarlightRibbon only (not shared with GradientCloud) */
export const FILMGRAIN_DEFAULTS = {
  grain_intensity: STARLIGHT_DEFAULTS.grain_intensity,
  grain_intensity_to: STARLIGHT_DEFAULTS.grain_intensity_to,
};

/**
 * GradientCloud — own canvas (not on shared ThreeJSCanvas).
 * Used as div background via <GradientCloud /> / <CTADiv />.
 * Has its own grain — does not use FILMGRAIN_DEFAULTS.
 */
export const GRADIENTCLOUD_DEFAULTS = {
  speed: 0.431,
  opacity: 1,
  grain_intensity: 0.13,
  noise_size: 0.85,
  rotation_speed: 1.3, // degrees per second — keeps spinning
  colors: ['#6a1c0a', '#ff6a14', '#ffe89c'] as [string, string, string],
};

/** Live GradientCloud knobs — the panel writes these, GradientCloud reads each frame */
export const gradientCloudLive = {
  grain_intensity: GRADIENTCLOUD_DEFAULTS.grain_intensity,
  noise_size: GRADIENTCLOUD_DEFAULTS.noise_size,
  rotation_speed: GRADIENTCLOUD_DEFAULTS.rotation_speed,
};

/**
 * Flat panel state for ThreeJSCanvas.
 * GradientCloud grain is `gradient_grain_intensity` so it never drives Starlight.
 */
export const THREEJS_PANEL_DEFAULTS = {
  ...STARLIGHT_DEFAULTS,
  ...SUNGLOW_DEFAULTS,
  // Starlight grain range (animated); GradientCloud grain is separate
  grain_intensity: STARLIGHT_DEFAULTS.grain_intensity,
  grain_intensity_to: STARLIGHT_DEFAULTS.grain_intensity_to,
  gradient_grain_intensity: GRADIENTCLOUD_DEFAULTS.grain_intensity,
  noise_size: GRADIENTCLOUD_DEFAULTS.noise_size,
  rotation_speed: GRADIENTCLOUD_DEFAULTS.rotation_speed,
};

export type ThreeJSPanelParams = typeof THREEJS_PANEL_DEFAULTS;
