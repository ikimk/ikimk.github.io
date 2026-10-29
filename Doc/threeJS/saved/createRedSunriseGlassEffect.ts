import * as THREE from 'three';

/** Bump when the fragment shader string changes so RedSunriseGlassEffect remounts on HMR. */
export const RED_SUNRISE_GLASS_SHADER_REV = 10;

/**
 * RedSunriseGlassEffect — DesignSystem red/orange/yellow/light-blue + sun motion.
 *
 * - Same motion as PinkSunriseGlassEffect: origin at bottom center, circular bands,
 *   expanding light rings, static vertical fluted glass.
 * - Palette: DesignSystem only — red → orange → yellow → light blue.
 * - No film grain.
 */

const redSunriseVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const redSunriseFragment = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOpacity;
  uniform float uRibs;
  uniform float uGlass;
  uniform float uSpread;
  uniform float uWave;
  uniform float uAspect;
  uniform vec3 uRed;
  uniform vec3 uOrange;
  uniform vec3 uYellow;
  uniform vec3 uLightBlue;
  varying vec2 vUv;

  // 4 DesignSystem stops: red (sun) → orange → yellow → light blue (outer)
  vec3 redSunStop(int i) {
    if (i == 0) return uRed;
    if (i == 1) return uOrange;
    if (i == 2) return uYellow;
    return uLightBlue;
  }

  // Catmull-Rom through the stops (C1-smooth). u in [0, 1].
  vec3 redSunPalette(float u) {
    float f = clamp(u, 0.0, 1.0) * 3.0;
    int i1 = int(min(floor(f), 2.0));
    float t = f - float(i1);
    int i0 = i1 == 0 ? 0 : i1 - 1;
    int i2 = i1 + 1;
    int i3 = i2 == 3 ? 3 : i2 + 1;
    vec3 c0 = redSunStop(i0);
    vec3 c1 = redSunStop(i1);
    vec3 c2 = redSunStop(i2);
    vec3 c3 = redSunStop(i3);
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

    // Static vertical fluted glass — same cylindrical refraction as PinkSunrise
    float ribPos = uv.x * uRibs;
    float ribId = floor(ribPos);
    float ribF = fract(ribPos);
    float lens = ribF * 2.0 - 1.0;
    lens = lens * (1.5 - 0.5 * lens * lens);
    float sx = clamp((ribId + 0.5 + lens * 0.5 * uGlass) / uRibs, 0.0, 1.0);

    // Sun origin at the bottom center
    vec2 p = vec2((sx - 0.5) * uAspect * uSpread, uv.y + 0.03);
    float d = length(p);

    // Rings of light spreading outward from the sun
    float ring = sin(6.2832 * (d * 1.2 - t * 0.06));
    float u = d * 0.74 + uWave * ring * smoothstep(0.0, 0.25, d);

    vec3 col = redSunPalette(u);

    // Soft light ramp across each rib (no black / white strips)
    float ramp = (0.5 - ribF) * 0.2 * clamp(uGlass, 0.0, 2.0);
    col *= 1.0 + ramp;
    col += vec3(max(ramp, 0.0)) * 0.25;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

export type RedSunriseGlassEffectParams = {
  speed: number;
  opacity: number;
  ribs: number;
  glass: number;
  spread: number;
  wave: number;
  red: string;
  orange: string;
  yellow: string;
  lightBlue: string;
};

export type RedSunriseGlassEffectHandle = {
  update: (time: number, params: RedSunriseGlassEffectParams) => void;
  resize: (viewW: number, viewH: number) => void;
  dispose: () => void;
};

const TmpColor = new THREE.Color();

/** Keep hex as plain sRGB numbers (shader outputs them directly). */
function SetColorUniform(target: THREE.Vector3, hex: string) {
  TmpColor.setStyle(hex, THREE.LinearSRGBColorSpace);
  target.set(TmpColor.r, TmpColor.g, TmpColor.b);
}

export function createRedSunriseGlassEffect(
  scene: THREE.Scene,
  defaults: RedSunriseGlassEffectParams,
): RedSunriseGlassEffectHandle {
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
      uRed: { value: ColorVec(defaults.red) },
      uOrange: { value: ColorVec(defaults.orange) },
      uYellow: { value: ColorVec(defaults.yellow) },
      uLightBlue: { value: ColorVec(defaults.lightBlue) },
    },
    vertexShader: redSunriseVertex,
    fragmentShader: redSunriseFragment,
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
      SetColorUniform(material.uniforms.uRed.value, params.red);
      SetColorUniform(material.uniforms.uOrange.value, params.orange);
      SetColorUniform(material.uniforms.uYellow.value, params.yellow);
      SetColorUniform(material.uniforms.uLightBlue.value, params.lightBlue);
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
