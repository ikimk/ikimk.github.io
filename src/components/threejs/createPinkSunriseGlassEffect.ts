import * as THREE from 'three';

/** Bump when the fragment shader string changes so PinkSunriseGlassEffect remounts on HMR. */
export const PINK_SUNRISE_GLASS_SHADER_REV = 6;

/**
 * PinkSunriseGlassEffect — a sun at the bottom center spreading pink/orange light.
 *
 * - Gradient origin sits at the bottom center; color is a function of distance
 *   from it, so the bands are circles (widened sideways by `spread`).
 * - Motion: soft rings of light expand outward from the sun (distance-based sine).
 * - Static vertical fluted glass on top (never depends on time): each rib is a
 *   cylindrical lens that collapses the gradient into vertical color streaks.
 * - Colors are out-of-design-system tokens from threeJSColors.ts.
 */

const pinkSunriseVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const pinkSunriseFragment = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOpacity;
  uniform float uRibs;
  uniform float uGlass;
  uniform float uSpread;
  uniform float uWave;
  uniform float uAspect;
  uniform vec3 uCore;
  uniform vec3 uOrange;
  uniform vec3 uCoral;
  uniform vec3 uPink;
  uniform vec3 uLavender;
  uniform vec3 uMist;
  varying vec2 vUv;

  // 6 stops, evenly spaced: core → orange → coral → pink → lavender → mist
  vec3 sunStop(int i) {
    if (i == 0) return uCore;
    if (i == 1) return uOrange;
    if (i == 2) return uCoral;
    if (i == 3) return uPink;
    if (i == 4) return uLavender;
    return uMist;
  }

  // Catmull-Rom through the stops (C1-smooth → no banding). u in [0, 1].
  vec3 sunPalette(float u) {
    float f = clamp(u, 0.0, 1.0) * 5.0;
    int i1 = int(min(floor(f), 4.0));
    float t = f - float(i1);
    int i0 = i1 == 0 ? 0 : i1 - 1;
    int i2 = i1 + 1;
    int i3 = i2 == 5 ? 5 : i2 + 1;
    vec3 c0 = sunStop(i0);
    vec3 c1 = sunStop(i1);
    vec3 c2 = sunStop(i2);
    vec3 c3 = sunStop(i3);
    vec3 col = 0.5 * (
      2.0 * c1 +
      (c2 - c0) * t +
      (2.0 * c0 - 5.0 * c1 + 4.0 * c2 - c3) * t * t +
      (3.0 * c1 - c0 - 3.0 * c2 + c3) * t * t * t
    );
    return clamp(col, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * uSpeed;

    // Static vertical fluted glass (never on time) — pure refraction.
    // Each rib is a cylindrical lens: the gradient is sampled through a smooth
    // curve across the rib, so colors bend/shift inside it and jump softly at the
    // seam to the next rib. No fake dark / white strips.
    float ribPos = uv.x * uRibs;
    float ribId = floor(ribPos);
    float ribF = fract(ribPos);
    float lens = ribF * 2.0 - 1.0;                     // −1 … 1 across the rib
    lens = lens * (1.5 - 0.5 * lens * lens);           // soft cubic (steeper in the middle)
    float sx = clamp((ribId + 0.5 + lens * 0.5 * uGlass) / uRibs, 0.0, 1.0);

    // Sun origin at the bottom center, slightly below the card edge.
    vec2 p = vec2((sx - 0.5) * uAspect * uSpread, uv.y + 0.03);
    float d = length(p);

    // Rings of light spreading outward from the sun (calm near the core).
    float ring = sin(6.2832 * (d * 1.2 - t * 0.06));
    float u = d * 0.74 + uWave * ring * smoothstep(0.0, 0.25, d);

    vec3 col = sunPalette(u);

    // Soft light ramp across the full rib width (left brighter → right a bit darker),
    // tinted by the local color — no thin white / black lines. Clean step at the seam.
    float ramp = (0.5 - ribF) * 0.2 * clamp(uGlass, 0.0, 2.0);
    col *= 1.0 + ramp;
    col += vec3(max(ramp, 0.0)) * 0.25;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

export type PinkSunriseGlassEffectParams = {
  speed: number;
  opacity: number;
  ribs: number;
  glass: number;
  spread: number;
  wave: number;
  core: string;
  orange: string;
  coral: string;
  pink: string;
  lavender: string;
  mist: string;
};

export type PinkSunriseGlassEffectHandle = {
  update: (time: number, params: PinkSunriseGlassEffectParams) => void;
  resize: (viewW: number, viewH: number) => void;
  dispose: () => void;
};

const TmpColor = new THREE.Color();

/** Keep hex as plain sRGB numbers (shader outputs them directly, no linear→sRGB step). */
function SetColorUniform(target: THREE.Vector3, hex: string) {
  TmpColor.setStyle(hex, THREE.LinearSRGBColorSpace);
  target.set(TmpColor.r, TmpColor.g, TmpColor.b);
}

export function createPinkSunriseGlassEffect(
  scene: THREE.Scene,
  defaults: PinkSunriseGlassEffectParams,
): PinkSunriseGlassEffectHandle {
  function ColorVec(hex: string) {
    const v = new THREE.Vector3();
    SetColorUniform(v, hex);
    return v;
  }

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: defaults.speed },
      uOpacity: { value: defaults.opacity },
      uRibs: { value: defaults.ribs },
      uGlass: { value: defaults.glass },
      uSpread: { value: defaults.spread },
      uWave: { value: defaults.wave },
      uAspect: { value: 0.63 },
      uCore: { value: ColorVec(defaults.core) },
      uOrange: { value: ColorVec(defaults.orange) },
      uCoral: { value: ColorVec(defaults.coral) },
      uPink: { value: ColorVec(defaults.pink) },
      uLavender: { value: ColorVec(defaults.lavender) },
      uMist: { value: ColorVec(defaults.mist) },
    },
    vertexShader: pinkSunriseVertex,
    fragmentShader: pinkSunriseFragment,
    transparent: false,
    depthWrite: false,
    depthTest: false,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  return {
    update(time, params) {
      material.uniforms.uTime.value = time;
      material.uniforms.uSpeed.value = params.speed;
      material.uniforms.uOpacity.value = params.opacity;
      material.uniforms.uRibs.value = params.ribs;
      material.uniforms.uGlass.value = params.glass;
      material.uniforms.uSpread.value = params.spread;
      material.uniforms.uWave.value = params.wave;
      SetColorUniform(material.uniforms.uCore.value, params.core);
      SetColorUniform(material.uniforms.uOrange.value, params.orange);
      SetColorUniform(material.uniforms.uCoral.value, params.coral);
      SetColorUniform(material.uniforms.uPink.value, params.pink);
      SetColorUniform(material.uniforms.uLavender.value, params.lavender);
      SetColorUniform(material.uniforms.uMist.value, params.mist);
    },
    resize(viewW, viewH) {
      mesh.scale.set(viewW, viewH, 1);
      mesh.position.set(0, 0, 0);
      material.uniforms.uAspect.value = viewW / viewH;
    },
    dispose() {
      scene.remove(mesh);
      mesh.geometry.dispose();
      material.dispose();
    },
  };
}
