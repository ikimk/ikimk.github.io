/**
 * Three.js playground — all tunable defaults in one place.
 * Edit values here; the control panel in ThreeJSCanvas reads these.
 * Names match panel labels (snake_case).
 *
 * See Doc/threeJS/ThreeJSComponents.md for effect names.
 */

import {
  ThreeColorPinkSunriseCore,
  ThreeColorPinkSunriseCoral,
  ThreeColorPinkSunriseLavender,
  ThreeColorPinkSunriseMist,
  ThreeColorPinkSunriseOrange,
  ThreeColorPinkSunrisePink,
  ThreeColorRedSunriseLightBlue,
  ThreeColorRedSunriseOrange,
  ThreeColorRedSunriseRed,
  ThreeColorRedSunriseYellow,
  ThreeColorWarmGradient,
} from '@/components/threejs/threeJSColors';

/** Scroll smoothing (host loop, not an effect) */
export const LerpEase = 0.07;
export const RecoverLerp = 0.05;

/** StarlightRibbon — bottom ribbon + its sun bloom */
export const STARLIGHT_DEFAULTS = {
  wave_offset_y: -7, // px — positive = up, negative = down
  wavelength: 0.85,
  amplitude: 0.018,
  scroll_intensity: 0.9,
  curve_width: 0.12,
  ribbon_sun_glow: 0.6,
  ribbon_sun_on_scroll: 0.35,
  ribbon_sun_opacity: 0.6,
  /**
   * Dark→light bg blend above the ribbon (page bg color).
   * height = how far up the viewport (0–1); strength = veil opacity.
   */
  blend_height: 0.1,
  blend_strength: 0.5,
  /** Starlight FilmGrain — animates between these (Starlight only) */
  grain_intensity: 0.13,
  grain_intensity_to: 0.31,
};

/** SunGlow — top edge only (no FilmGrain) */
export const SUNGLOW_DEFAULTS = {
  sun_glow: 0.6,
  sun_glow_on_scroll: 0.35,
  sun_opacity: 0.35,
};

/** PSGrid — PlayStation-button wallpaper (□ △ ○ ✕); glyphs down, noise up + Bend */
export const PSGRID_DEFAULTS = {
  scale: 27,
  glyph_size: 0.1,
  stroke: 0.038,
  opacity: 0.18,
  opacity_to: 0.5,
  noise_scale: 0.12,
  noise_amount: 0.9,
  noise_speed: 1.13,
  glyph_speed: 0.17,
  size_min: 0.02,
  bend: 0.13,
  bend_to: 0.431,
  fade_top: 0.31,
  /** Page-scroll depth: UV Y shift per viewport scrolled (small = subtle parallax) */
  parallax: 0.65,
};

/** FilmGrain — StarlightRibbon only (not shared with GradientCloud) */
export const FILMGRAIN_DEFAULTS = {
  grain_intensity: STARLIGHT_DEFAULTS.grain_intensity,
  grain_intensity_to: STARLIGHT_DEFAULTS.grain_intensity_to,
};

/**
 * GradientCloud — ready for later (not mounted on `/test` playground).
 * Own canvas via <GradientCloud /> / <CTADiv />. Own grain (not FILMGRAIN_DEFAULTS).
 */
export const GRADIENTCLOUD_DEFAULTS = {
  speed: 0.431,
  opacity: 1,
  grain_intensity: 0.13,
  noise_size: 0.85,
  rotation_speed: 1.3, // degrees per second — keeps spinning
  colors: ThreeColorWarmGradient,
};

/** Live GradientCloud knobs — wire when GradientCloud is mounted again */
export const gradientCloudLive = {
  grain_intensity: GRADIENTCLOUD_DEFAULTS.grain_intensity,
  noise_size: GRADIENTCLOUD_DEFAULTS.noise_size,
  rotation_speed: GRADIENTCLOUD_DEFAULTS.rotation_speed,
};

/**
 * RedSunriseGlassEffect — DesignSystem red/orange/yellow/light-blue + sun motion.
 * Same knobs as PinkSunrise (speed, ribs, glass, spread, wave). No grain.
 */
export const RED_SUNRISE_GLASS_DEFAULTS = {
  speed: 3.1,
  opacity: 1,
  ribs: 20,
  glass: 0.07,
  spread: 2.3,
  wave: 0.11,
  red: ThreeColorRedSunriseRed,
  orange: ThreeColorRedSunriseOrange,
  yellow: ThreeColorRedSunriseYellow,
  lightBlue: ThreeColorRedSunriseLightBlue,
};

/**
 * PinkSunriseGlassEffect — sun at the bottom spreads pink/orange light in circles,
 * viewed through static vertical reeded glass. Colors are out of design system.
 */
export const PINK_SUNRISE_GLASS_DEFAULTS = {
  speed: 3.1,
  opacity: 1,
  /** vertical fluted-glass ribs across the width (static, even spacing) */
  ribs: 20,
  /** glass strength: 0 = flat, ~1 = clear refraction, higher = stronger bend */
  glass: 0.07,
  /** how wide the sun spreads sideways (1 = true circles, higher = wider) */
  spread: 2.3,
  /** strength of the expanding light rings */
  wave: 0.11,
  core: ThreeColorPinkSunriseCore,
  orange: ThreeColorPinkSunriseOrange,
  coral: ThreeColorPinkSunriseCoral,
  pink: ThreeColorPinkSunrisePink,
  lavender: ThreeColorPinkSunriseLavender,
  mist: ThreeColorPinkSunriseMist,
};

export const pinkSunriseGlassLive = {
  speed: PINK_SUNRISE_GLASS_DEFAULTS.speed,
  ribs: PINK_SUNRISE_GLASS_DEFAULTS.ribs,
  glass: PINK_SUNRISE_GLASS_DEFAULTS.glass,
  spread: PINK_SUNRISE_GLASS_DEFAULTS.spread,
  wave: PINK_SUNRISE_GLASS_DEFAULTS.wave,
};

export const redSunriseGlassLive = {
  speed: RED_SUNRISE_GLASS_DEFAULTS.speed,
  ribs: RED_SUNRISE_GLASS_DEFAULTS.ribs,
  glass: RED_SUNRISE_GLASS_DEFAULTS.glass,
  spread: RED_SUNRISE_GLASS_DEFAULTS.spread,
  wave: RED_SUNRISE_GLASS_DEFAULTS.wave,
};

/**
 * Flat panel state for ThreeJSCanvas (shared-canvas effects only).
 */
export const THREEJS_PANEL_DEFAULTS = {
  ...STARLIGHT_DEFAULTS,
  ...SUNGLOW_DEFAULTS,
  ...PSGRID_DEFAULTS,
  grain_intensity: STARLIGHT_DEFAULTS.grain_intensity,
  grain_intensity_to: STARLIGHT_DEFAULTS.grain_intensity_to,
};

export type ThreeJSPanelParams = typeof THREEJS_PANEL_DEFAULTS;
