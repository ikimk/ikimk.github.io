import * as THREE from 'three';
import { filmGrainGlsl, filmGrainUniform } from '@/components/threejs/createFilmGrain';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waveYGlsl = `
  // Figma bend: flush to bottom, peaks in center, tapers to 0 at left/right edges
  float waveY(float x, float t, float scroll) {
    float xx = clamp(x, 0.0, 1.0);
    // 0 at both screen edges, 1 at center — the lens / arch envelope
    float arch = sin(xx * 3.14159265);
    // curve_width: lower = pointier peak, higher = fuller / flatter mid
    float power = mix(1.45, 0.50, clamp(uCurveWidth, 0.0, 1.0));
    arch = pow(max(arch, 0.0), power);

    float amp = uAmplitude + abs(scroll) * uAmplitude * 1.15 * uScrollIntensity;
    // original peak scale (~2× amp); arch only reshapes it to touch the edges
    float height = amp * 2.0 + abs(scroll) * 0.02 * uScrollIntensity;

    // small standing ripple, scaled by arch so corners stay pinned to the edge
    float osc = sin(t * 1.8 + scroll * 0.6 * uScrollIntensity);
    float ripple = sin(xx * 6.2831853 * max(uWavelength, 0.3)) * osc * amp * 0.35;

    return max(0.0, arch * height + ripple * arch);
  }
`;

const ribbonFragmentShader = `
  uniform float uTime;
  uniform float uAspect;
  uniform float uScrollAmount;
  uniform float uWavelength;
  uniform float uAmplitude;
  uniform float uScrollIntensity;
  uniform float uCurveWidth;
  varying vec2 vUv;

  ${waveYGlsl}
  ${filmGrainGlsl}

  float glow(float d, float tight) {
    return exp(-d * d * tight);
  }

  vec3 starlightRgb(float across, float x) {
    vec3 red = vec3(1.0, 0.12, 0.08);
    vec3 orange = vec3(1.0, 0.5, 0.08);
    vec3 yellow = vec3(1.0, 0.88, 0.35);
    vec3 cyan = vec3(0.15, 0.95, 0.82);
    vec3 blue = vec3(0.06, 0.28, 1.0);

    vec3 color = blue;
    color = mix(color, cyan, smoothstep(0.08, 0.34, across));
    // slightly thinner yellow band; orange/red come in a bit earlier
    color = mix(color, yellow, smoothstep(0.32, 0.50, across));
    color = mix(color, orange, smoothstep(0.46, 0.70, across));
    color = mix(color, red, smoothstep(0.64, 0.94, across));

    // blue on both lifted corners, warm through the middle
    float edge = pow(abs(x - 0.5) * 2.0, 2.2);
    color = mix(color, mix(blue, cyan, 0.35), edge * 0.7);
    return color;
  }

  void main() {
    vec2 uv = vUv;
    float x = uv.x;
    float t = uTime;
    float scroll = uScrollAmount;

    float y0 = waveY(x, t, scroll);
    float d = uv.y - y0;
    float ad = abs(d);

    float thickness = 0.07 + abs(scroll) * 0.02;
    float across = clamp(d / max(thickness, 0.0001) * 0.5 + 0.5, 0.0, 1.0);
    across = max(across, 0.42);
    vec3 color = starlightRgb(across, x);

    float ribbon = glow(ad / max(thickness, 0.0001), 2.4);
    float aura = glow(ad / max(thickness * 2.6, 0.0001), 1.1);

    float under = 1.0 - smoothstep(y0 - 0.012, y0 + 0.004, uv.y);
    float fillFade = smoothstep(0.0, max(y0, 0.001), uv.y);
    float fill = under * mix(0.35, 1.0, fillFade);

    float edgeT = pow(abs(x - 0.5) * 2.0, 1.5);
    vec3 fillCol = starlightRgb(mix(0.72, 0.12, edgeT), x);

    vec3 outCol = color * (ribbon * 1.2 + aura * 0.4);
    outCol = mix(outCol, fillCol, fill * 0.85);
    outCol += fillCol * fill * 0.25;

    float alpha = max(clamp(ribbon * 0.95 + aura * 0.4, 0.0, 1.0), fill * 0.9);
    outCol = applyFilmGrain(outCol, alpha);

    gl_FragColor = vec4(outCol, alpha);
  }
`;

const bottomSunFragmentShader = `
  uniform float uTime;
  uniform float uScrollAmount;
  uniform float uWavelength;
  uniform float uAmplitude;
  uniform float uScrollIntensity;
  uniform float uCurveWidth;
  uniform float uSunGlow;
  uniform float uSunScroll;
  uniform float uSunOpacity;
  uniform float uRibbonScale;
  varying vec2 vUv;

  ${waveYGlsl}
  ${filmGrainGlsl}

  void main() {
    float x = vUv.x;
    float t = uTime;
    float scroll = uScrollAmount;

    float y0 = waveY(x, t, scroll) * uRibbonScale;
    float above = vUv.y - y0;
    if (above < -0.004) {
      gl_FragColor = vec4(0.0);
      return;
    }
    above = max(above, 0.0);

    float glowAmt = uSunGlow + sin(t * 0.85) * 0.1;
    float breath = 0.9 + 0.1 * sin(t * 0.7);
    // same standing up/down pulse as the ribbon (no left-to-right travel)
    float osc = sin(t * 1.8 + scroll * 0.6 * uScrollIntensity);
    float standing = sin(x * 6.2831853);
    float crest = 0.85 + 0.15 * standing * osc;
    float baseRise = exp(-above * 6.2);
    float baseHalo = exp(-above * 2.15) * 0.7;
    float baseStrength = glowAmt * breath * crest * (baseRise + baseHalo);

    float scrollPush = abs(scroll) * uSunScroll;
    float scrollTight = mix(6.0, 1.8, clamp(scrollPush, 0.0, 1.5) / 1.5);
    float scrollRise = exp(-above * scrollTight);
    float scrollHalo = exp(-above * scrollTight * 0.32) * 0.75;
    float scrollStrength = glowAmt * scrollPush * (scrollRise * 0.7 + scrollHalo);

    float sunStrength = (baseStrength + scrollStrength) * uSunOpacity;

    vec3 sunOrange = vec3(1.0, 0.32, 0.04);
    vec3 sunYellow = vec3(1.0, 0.78, 0.12);
    float heat = clamp(baseRise * 0.9 + scrollRise * scrollPush * 0.35, 0.0, 1.0);
    vec3 sunCol = mix(sunOrange, sunYellow, heat * 0.85);
    float alpha = clamp(sunStrength, 0.0, 1.0);
    sunCol = applyFilmGrain(sunCol * sunStrength, alpha);

    gl_FragColor = vec4(sunCol, alpha);
  }
`;

export type StarlightRibbonParams = {
  wavelength: number;
  amplitude: number;
  scroll_intensity: number;
  curve_width: number;
  ribbon_sun_glow: number;
  ribbon_sun_on_scroll: number;
  ribbon_sun_opacity: number;
  wave_offset_y: number;
  grain_intensity: number;
  grain_intensity_to: number;
};

export type StarlightRibbonEffect = {
  update: (time: number, scroll: number, params: StarlightRibbonParams) => void;
  resize: (viewW: number, viewH: number, screenH: number) => void;
  dispose: () => void;
};

function makeWaveUniforms(defaults: StarlightRibbonParams) {
  return {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uScrollAmount: { value: 0 },
    uWavelength: { value: defaults.wavelength },
    uAmplitude: { value: defaults.amplitude },
    uScrollIntensity: { value: defaults.scroll_intensity },
    uCurveWidth: { value: defaults.curve_width },
  };
}

export function createStarlightRibbon(
  scene: THREE.Scene,
  defaults: StarlightRibbonParams,
): StarlightRibbonEffect {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...makeWaveUniforms(defaults),
      uSunGlow: { value: defaults.ribbon_sun_glow },
      uSunScroll: { value: defaults.ribbon_sun_on_scroll },
      uSunOpacity: { value: defaults.ribbon_sun_opacity },
      uRibbonScale: { value: 0.18 / 0.5 },
      ...filmGrainUniform(defaults.grain_intensity),
    },
    vertexShader,
    fragmentShader: bottomSunFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const SunPlane = new THREE.Mesh(geometry, sunMaterial);
  SunPlane.renderOrder = 1;
  scene.add(SunPlane);

  const ribbonMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...makeWaveUniforms(defaults),
      ...filmGrainUniform(defaults.grain_intensity),
    },
    vertexShader,
    fragmentShader: ribbonFragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const WavePlane = new THREE.Mesh(geometry, ribbonMaterial);
  WavePlane.renderOrder = 2;
  scene.add(WavePlane);

  let viewW = 1;
  let viewH = 1;
  let screenH = 1;
  let wave_offset_y = defaults.wave_offset_y;

  function ApplyLayout() {
    const waveH = viewH * 0.18;
    const sunH = viewH * 0.5;
    const offsetY = (wave_offset_y / Math.max(screenH, 1)) * viewH;

    WavePlane.scale.set(viewW, waveH, 1);
    WavePlane.position.set(0, -viewH * 0.5 + waveH * 0.5 + offsetY, 0);
    ribbonMaterial.uniforms.uAspect.value = viewW / Math.max(waveH, 0.0001);

    SunPlane.scale.set(viewW, sunH, 1);
    SunPlane.position.set(0, -viewH * 0.5 + sunH * 0.5 + offsetY, -0.01);
    sunMaterial.uniforms.uRibbonScale.value = waveH / Math.max(sunH, 0.0001);
  }

  function SyncUniforms(mat: THREE.ShaderMaterial, time: number, scroll: number, params: StarlightRibbonParams) {
    mat.uniforms.uTime.value = time;
    mat.uniforms.uScrollAmount.value = scroll;
    mat.uniforms.uWavelength.value = params.wavelength;
    mat.uniforms.uAmplitude.value = params.amplitude;
    mat.uniforms.uScrollIntensity.value = params.scroll_intensity;
    mat.uniforms.uCurveWidth.value = params.curve_width;
  }

  return {
    update(time, scroll, params) {
      SyncUniforms(ribbonMaterial, time, scroll, params);
      SyncUniforms(sunMaterial, time, scroll, params);
      sunMaterial.uniforms.uSunGlow.value = params.ribbon_sun_glow;
      sunMaterial.uniforms.uSunScroll.value = params.ribbon_sun_on_scroll;
      sunMaterial.uniforms.uSunOpacity.value = params.ribbon_sun_opacity;
      // pulse Starlight grain between grain_intensity → grain_intensity_to
      const g0 = params.grain_intensity;
      const g1 = params.grain_intensity_to;
      const grain =
        g0 + (g1 - g0) * (0.5 + 0.5 * Math.sin(time * 1.1));
      ribbonMaterial.uniforms.uGrainIntensity.value = grain;
      sunMaterial.uniforms.uGrainIntensity.value = grain;
      if (params.wave_offset_y !== wave_offset_y) {
        wave_offset_y = params.wave_offset_y;
        ApplyLayout();
      }
    },
    resize(nextViewW, nextViewH, nextScreenH) {
      viewW = nextViewW;
      viewH = nextViewH;
      screenH = nextScreenH;
      ApplyLayout();
    },
    dispose() {
      scene.remove(WavePlane);
      scene.remove(SunPlane);
      geometry.dispose();
      ribbonMaterial.dispose();
      sunMaterial.dispose();
    },
  };
}
