import * as THREE from 'three';
import {
  ThreeColorPSGridBg,
  ThreeColorPSGridGlyph,
} from '@/components/threejs/threeJSColors';

/** Must match ThreeJSCanvas camera.position.z — used to overscan past perspective pinch */
const CAMERA_Z = 6.5;

const vertexShader = `
  uniform float uBend;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // 3D sine bend in Z (vertical curve) — amp from scroll
    vec3 p = position;
    p.z -= sin(uv.y * 3.14159265) * uBend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uResolution;
  uniform float uScale;
  uniform float uGlyphSize;
  uniform float uStroke;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uNoiseAmount;
  uniform float uNoiseSpeed;
  uniform float uGlyphSpeed;
  uniform float uSizeMin;
  uniform float uFadeTop;
  uniform vec3 uBg;
  uniform vec3 uGlyph;
  varying vec2 vUv;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // soft organic density field (halftone map)
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    v += a * valueNoise(p); p = p * 2.03 + 11.7; a *= 0.5;
    v += a * valueNoise(p); p = p * 2.01 - 3.1; a *= 0.5;
    v += a * valueNoise(p); p = p * 2.02 + 7.9; a *= 0.5;
    v += a * valueNoise(p);
    return v;
  }

  float sdCircle(vec2 p, float r) {
    return length(p) - r;
  }

  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  float sdEquilateralTriangle(vec2 p, float r) {
    float k = 1.7320508;
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) {
      p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    }
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
  }

  float sdSegment(vec2 p, vec2 a, vec2 b, float halfW) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
    return length(pa - ba * h) - halfW;
  }

  float sdCross(vec2 p, float r, float halfW) {
    return min(
      sdSegment(p, vec2(-r, -r), vec2(r, r), halfW),
      sdSegment(p, vec2(-r, r), vec2(r, -r), halfW)
    );
  }

  float stroke(float d, float w) {
    return 1.0 - smoothstep(0.0, w, abs(d));
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 uv = vUv;
    uv.x *= aspect;

    // □△○✕ grid scrolls down (top → bottom)
    vec2 p = uv * uScale;
    p.y += uTime * uGlyphSpeed;

    // brick stagger
    float row = floor(p.y);
    p.x += mod(row, 2.0) * 0.5;

    vec2 cell = floor(p);
    vec2 f = fract(p) - 0.5;

    // size field scrolls up independently (slower), screen-locked
    vec2 np = uv * uScale;
    np.y -= uTime * uNoiseSpeed;
    float nrow = floor(np.y);
    np.x += mod(nrow, 2.0) * 0.5;
    vec2 nCell = floor(np);
    float density = fbm(nCell * uNoiseScale);
    // gentle diagonal drift so clusters feel waved, not blob-blobs only
    float drift = 0.5 + 0.5 * sin(nCell.x * 0.21 + nCell.y * 0.13);
    density = mix(density, density * drift, 0.28);
    density = smoothstep(0.18, 0.82, density);

    float sizeMul = mix(uSizeMin, 1.0, mix(1.0, density, uNoiseAmount));
    float r = uGlyphSize * sizeMul;
    // thinner strokes on tiny glyphs so they stay crisp
    float sw = uStroke * mix(0.55, 1.0, sizeMul);

    float id = mod(cell.x + cell.y * 2.0, 4.0);
    float glyph = 0.0;
    if (id < 1.0) {
      glyph = stroke(sdBox(f, vec2(r)), sw);
    } else if (id < 2.0) {
      glyph = stroke(sdEquilateralTriangle(f, r * 1.15), sw);
    } else if (id < 3.0) {
      glyph = stroke(sdCircle(f, r), sw);
    } else {
      glyph = 1.0 - smoothstep(0.0, sw * 0.55, sdCross(f, r * 1.05, sw * 0.55));
    }

    // whisper-out the smallest dots (classic halftone fade)
    float presence = smoothstep(uSizeMin * 0.35, uSizeMin + 0.18, sizeMul);

    // top → down opacity: 0 at top edge, 1 after uFadeTop (e.g. 0.5 = 50vh)
    float fromTop = 1.0 - (gl_FragCoord.y / max(uResolution.y, 1.0));
    float topFade = smoothstep(0.0, max(uFadeTop, 0.001), fromTop);

    vec3 col = mix(uBg, uGlyph, glyph * uOpacity * presence * topFade);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

export type PSGridParams = {
  /** cells across the short axis (higher = denser) */
  scale: number;
  /** base glyph radius in cell space */
  glyph_size: number;
  /** outline thickness in cell space */
  stroke: number;
  /** glyph mix strength at rest 0–1 */
  opacity: number;
  /** glyph mix strength when scrolled */
  opacity_to: number;
  /** noise frequency for size field */
  noise_scale: number;
  /** 0 = uniform size, 1 = full halftone range */
  noise_amount: number;
  /** how fast the size field scrolls up (cells / sec) */
  noise_speed: number;
  /** how fast □△○✕ scroll down (cells / sec) */
  glyph_speed: number;
  /** minimum size as fraction of glyph_size */
  size_min: number;
  /** 3D Z sine amplitude at rest (world units) */
  bend: number;
  /** 3D Z sine amplitude when scrolled */
  bend_to: number;
  /** top fade height as fraction of viewport (0.5 = 50vh) */
  fade_top: number;
};

export type PSGridEffect = {
  update: (time: number, scroll: number, params: PSGridParams) => void;
  resize: (viewW: number, viewH: number, pixelW: number, pixelH: number) => void;
  dispose: () => void;
};

export type PSGridColors = {
  bg?: string;
  glyph?: string;
};

export function createPSGrid(
  scene: THREE.Scene,
  defaults?: Partial<PSGridParams>,
  colors?: PSGridColors,
): PSGridEffect {
  const scale = defaults?.scale ?? 23;
  const glyph_size = defaults?.glyph_size ?? 0.21;
  const stroke = defaults?.stroke ?? 0.028;
  const opacity = defaults?.opacity ?? 0.13;
  const noise_scale = defaults?.noise_scale ?? 0.11;
  const noise_amount = defaults?.noise_amount ?? 0.9;
  const noise_speed = defaults?.noise_speed ?? 0.18;
  const glyph_speed = defaults?.glyph_speed ?? 0.42;
  const size_min = defaults?.size_min ?? 0.12;
  const bend = defaults?.bend ?? 0.35;
  const fade_top = defaults?.fade_top ?? 0.5;
  const glyphHex = colors?.glyph ?? ThreeColorPSGridGlyph;
  const bgHex = colors?.bg ?? ThreeColorPSGridBg;

  // dense Y segments so the Z sine reads smooth
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 64);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uScale: { value: scale },
      uGlyphSize: { value: glyph_size },
      uStroke: { value: stroke },
      uOpacity: { value: opacity },
      uNoiseScale: { value: noise_scale },
      uNoiseAmount: { value: noise_amount },
      uNoiseSpeed: { value: noise_speed },
      uGlyphSpeed: { value: glyph_speed },
      uSizeMin: { value: size_min },
      uBend: { value: bend },
      uFadeTop: { value: fade_top },
      uBg: { value: hexToRgb(bgHex) },
      uGlyph: { value: hexToRgb(glyphHex) },
    },
    vertexShader,
    fragmentShader,
    depthWrite: false,
    transparent: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  scene.add(mesh);

  let layoutW = 1;
  let layoutH = 1;
  let bendAmp = bend;

  /** Widen past the viewport so perspective foreshortening never shows side gaps */
  function fitScale() {
    const overscan = ((CAMERA_Z + bendAmp) / CAMERA_Z) * 1.04;
    mesh.scale.set(layoutW * overscan, layoutH * overscan, 1);
    mesh.position.set(0, 0, 0);
  }

  return {
    update(time, scroll, params) {
      material.uniforms.uTime.value = time;
      material.uniforms.uScale.value = params.scale;
      material.uniforms.uGlyphSize.value = params.glyph_size;
      material.uniforms.uStroke.value = params.stroke;
      material.uniforms.uNoiseScale.value = params.noise_scale;
      material.uniforms.uNoiseAmount.value = params.noise_amount;
      material.uniforms.uNoiseSpeed.value = params.noise_speed;
      material.uniforms.uGlyphSpeed.value = params.glyph_speed;
      material.uniforms.uSizeMin.value = params.size_min;
      material.uniforms.uFadeTop.value = params.fade_top;
      // opacity + bend amp: rest → scroll targets
      const scrollT = Math.min(Math.abs(scroll), 1);
      material.uniforms.uOpacity.value =
        params.opacity + (params.opacity_to - params.opacity) * scrollT;
      bendAmp = params.bend + (params.bend_to - params.bend) * scrollT;
      material.uniforms.uBend.value = bendAmp;
      fitScale();
    },
    resize(viewW, viewH, pixelW, pixelH) {
      layoutW = viewW;
      layoutH = viewH;
      fitScale();
      material.uniforms.uResolution.value.set(pixelW, pixelH);
    },
    dispose() {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
