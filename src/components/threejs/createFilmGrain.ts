/**
 * FilmGrain — static GLSL grain, opt-in per effect.
 *
 * Do NOT mount a fullscreen grain plane.
 * Wire `filmGrainGlsl` + `filmGrainUniform` only into effects that should show grain
 * (currently: StarlightRibbon, GradientCloud).
 *
 * HARD RULE — grain on the drawn effect / element only, never on blank / bg:
 * pass `coverage` = that effect’s alpha / drawn strength (0 on empty pixels).
 * `applyFilmGrain(color, coverage)` already multiplies grain by coverage.
 * See Doc/threeJS/ThreeJSComponents.md + `.cursor/rules/threejs-single-canvas.mdc`.
 */

/** FilmGrain-only params — independent of other effects */
export type FilmGrainParams = {
  grain_intensity: number;
};

/** Shared static grain helpers — include in selected effect fragment shaders */
export const filmGrainGlsl = `
  uniform float uGrainIntensity;

  float filmGrainHash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // coverage 0..1 — MUST be effect/element mask (glyphs, ribbon alpha…).
  // Never pass 1.0 over a full-screen bg; blank pixels → coverage 0 → no grain.
  vec3 applyFilmGrain(vec3 color, float coverage) {
    float n = filmGrainHash(gl_FragCoord.xy);
    float g = pow(n, 1.35) * uGrainIntensity * clamp(coverage, 0.0, 1.0);
    return color + vec3(g);
  }
`;

export function filmGrainUniform(grain_intensity = 0.13) {
  return {
    uGrainIntensity: { value: grain_intensity },
  };
}
