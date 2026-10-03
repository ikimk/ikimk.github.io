import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waveYGlsl = `
  float waveY(float x, float t, float scroll) {
    float nx = abs(x - 0.5) * 2.0;
    float zone = mix(0.07, 1.0, pow(clamp(uCurveWidth, 0.0, 1.0), 0.75));
    float start = 1.0 - zone;
    float edge = pow(clamp((nx - start) / max(zone, 0.0001), 0.0, 1.0), 2.2);
    float uLift = edge * (uEdgeHeight + abs(scroll) * 0.1 * uScrollIntensity);

    float freq = 1.0 / max(uWavelength, 0.15);
    float maxH = uAmplitude * 1.3 + abs(scroll) * uAmplitude * 1.6 * uScrollIntensity;
    float y = 0.0;
    y += sin(x * 6.2831853 * freq - t * 0.5 + scroll * 1.4 * uScrollIntensity) * (uAmplitude + scroll * uAmplitude * 1.15 * uScrollIntensity);
    y += sin(x * 6.2831853 * freq * 0.5 + t * 0.25 - scroll * 0.8 * uScrollIntensity) * (uAmplitude * 0.35 + scroll * uAmplitude * 0.4 * uScrollIntensity);
    y = clamp(y, -maxH, maxH);

    return 0.0 + uLift + y;
  }
`;

const ribbonFragmentShader = `
  uniform float uTime;
  uniform float uAspect;
  uniform float uScrollAmount;
  uniform float uEdgeHeight;
  uniform float uWavelength;
  uniform float uAmplitude;
  uniform float uScrollIntensity;
  uniform float uCurveWidth;
  varying vec2 vUv;

  ${waveYGlsl}

  float glow(float d, float tight) {
    return exp(-d * d * tight);
  }

  vec3 siriRgb(float across, float x) {
    vec3 red = vec3(1.0, 0.12, 0.08);
    vec3 orange = vec3(1.0, 0.5, 0.08);
    vec3 yellow = vec3(1.0, 0.88, 0.35);
    vec3 cyan = vec3(0.15, 0.95, 0.82);
    vec3 blue = vec3(0.06, 0.28, 1.0);

    vec3 color = blue;
    color = mix(color, cyan, smoothstep(0.08, 0.38, across));
    color = mix(color, yellow, smoothstep(0.36, 0.58, across));
    color = mix(color, orange, smoothstep(0.55, 0.78, across));
    color = mix(color, red, smoothstep(0.74, 1.0, across));

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
    across = max(across, 0.48);
    vec3 color = siriRgb(across, x);

    float ribbon = glow(ad / max(thickness, 0.0001), 2.4);
    float aura = glow(ad / max(thickness * 2.6, 0.0001), 1.1);

    float under = 1.0 - smoothstep(y0 - 0.012, y0 + 0.004, uv.y);
    float fillFade = smoothstep(0.0, max(y0, 0.001), uv.y);
    float fill = under * mix(0.35, 1.0, fillFade);

    float edgeT = pow(abs(x - 0.5) * 2.0, 1.5);
    vec3 fillCol = siriRgb(mix(0.6, 0.1, edgeT), x);

    vec3 outCol = color * (ribbon * 1.2 + aura * 0.4);
    outCol = mix(outCol, fillCol, fill * 0.85);
    outCol += fillCol * fill * 0.25;

    float alpha = max(clamp(ribbon * 0.95 + aura * 0.4, 0.0, 1.0), fill * 0.9);

    gl_FragColor = vec4(outCol, alpha);
  }
`;

const bottomSunFragmentShader = `
  uniform float uTime;
  uniform float uScrollAmount;
  uniform float uEdgeHeight;
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
    float breath = 0.9 + 0.1 * sin(t * 0.7 + x * 2.4);
    float crest = 0.85 + 0.15 * sin(x * 6.2831853 / max(uWavelength, 0.15) - t * 0.5);
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

    gl_FragColor = vec4(sunCol * sunStrength, clamp(sunStrength, 0.0, 1.0));
  }
`;

export type SiriRibbonParams = {
  edgeHeight: number;
  wavelength: number;
  amplitude: number;
  scrollIntensity: number;
  curveWidth: number;
  sunGlow: number;
  sunScroll: number;
  sunOpacityBottom: number;
};

export type SiriRibbonEffect = {
  update: (time: number, scroll: number, params: SiriRibbonParams) => void;
  resize: (viewW: number, viewH: number) => void;
  dispose: () => void;
};

function makeWaveUniforms(defaults: SiriRibbonParams) {
  return {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uScrollAmount: { value: 0 },
    uEdgeHeight: { value: defaults.edgeHeight },
    uWavelength: { value: defaults.wavelength },
    uAmplitude: { value: defaults.amplitude },
    uScrollIntensity: { value: defaults.scrollIntensity },
    uCurveWidth: { value: defaults.curveWidth },
  };
}

export function createSiriRibbon(
  scene: THREE.Scene,
  defaults: SiriRibbonParams,
): SiriRibbonEffect {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...makeWaveUniforms(defaults),
      uSunGlow: { value: defaults.sunGlow },
      uSunScroll: { value: defaults.sunScroll },
      uSunOpacity: { value: defaults.sunOpacityBottom },
      uRibbonScale: { value: 0.18 / 0.5 },
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
    uniforms: makeWaveUniforms(defaults),
    vertexShader,
    fragmentShader: ribbonFragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const WavePlane = new THREE.Mesh(geometry, ribbonMaterial);
  WavePlane.renderOrder = 2;
  scene.add(WavePlane);

  function SyncUniforms(mat: THREE.ShaderMaterial, time: number, scroll: number, params: SiriRibbonParams) {
    mat.uniforms.uTime.value = time;
    mat.uniforms.uScrollAmount.value = scroll;
    mat.uniforms.uEdgeHeight.value = params.edgeHeight;
    mat.uniforms.uWavelength.value = params.wavelength;
    mat.uniforms.uAmplitude.value = params.amplitude;
    mat.uniforms.uScrollIntensity.value = params.scrollIntensity;
    mat.uniforms.uCurveWidth.value = params.curveWidth;
  }

  return {
    update(time, scroll, params) {
      SyncUniforms(ribbonMaterial, time, scroll, params);
      SyncUniforms(sunMaterial, time, scroll, params);
      sunMaterial.uniforms.uSunGlow.value = params.sunGlow;
      sunMaterial.uniforms.uSunScroll.value = params.sunScroll;
      sunMaterial.uniforms.uSunOpacity.value = params.sunOpacityBottom;
    },
    resize(viewW, viewH) {
      const waveH = viewH * 0.18;
      const sunH = viewH * 0.5;

      WavePlane.scale.set(viewW, waveH, 1);
      WavePlane.position.set(0, -viewH * 0.5 + waveH * 0.5, 0);
      ribbonMaterial.uniforms.uAspect.value = viewW / Math.max(waveH, 0.0001);

      SunPlane.scale.set(viewW, sunH, 1);
      SunPlane.position.set(0, -viewH * 0.5 + sunH * 0.5, -0.01);
      sunMaterial.uniforms.uRibbonScale.value = waveH / Math.max(sunH, 0.0001);
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
