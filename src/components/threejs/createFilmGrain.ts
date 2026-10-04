/**
 * FilmGrain — static GLSL grain, opt-in per effect.
 *
 * Do NOT mount a fullscreen grain plane.
 * Wire `filmGrainGlsl` + `filmGrainUniform` only into effects that should show grain
 * (currently: StarlightRibbon). See Doc/threeJS/ThreeJSComponents.md.
 */

/** FilmGrain-only params — intensity is independent of other effects */
export type FilmGrainParams = {
  intensity: number;
};

/** Shared static grain helpers — include in selected effect fragment shaders */
export const filmGrainGlsl = `
  uniform float uGrainIntensity;

  float filmGrainHash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // coverage 0..1 — grain only where the effect draws
  vec3 applyFilmGrain(vec3 color, float coverage) {
    float n = filmGrainHash(gl_FragCoord.xy);
    float g = pow(n, 1.35) * uGrainIntensity * clamp(coverage, 0.0, 1.0);
    return color + vec3(g);
  }
`;

export function filmGrainUniform(intensity = 0.18) {
  return {
    uGrainIntensity: { value: intensity },
  };
}
