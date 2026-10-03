import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
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

  void main() {
    float x = vUv.x;
    float t = uTime;
    float scroll = uScrollAmount;

    // straight top edge — no wave on the source line
    float above = max(vUv.y, 0.0);

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

export type TopSunGlowParams = {
  wavelength: number;
  amplitude: number;
  scrollIntensity: number;
  curveWidth: number;
  sunGlow: number;
  sunScroll: number;
  sunOpacityTop: number;
};

export type TopSunGlowEffect = {
  update: (time: number, scroll: number, params: TopSunGlowParams) => void;
  resize: (viewW: number, viewH: number) => void;
  dispose: () => void;
};

export function createTopSunGlow(scene: THREE.Scene): TopSunGlowEffect {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollAmount: { value: 0 },
      uWavelength: { value: 0.7 },
      uAmplitude: { value: 0.018 },
      uScrollIntensity: { value: 0.9 },
      uCurveWidth: { value: 0.12 },
      uSunGlow: { value: 0.6 },
      uSunScroll: { value: 0.35 },
      uSunOpacity: { value: 0.4 },
      uRibbonScale: { value: 0.18 / 0.5 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 0;
  scene.add(mesh);

  return {
    update(time, scroll, params) {
      material.uniforms.uTime.value = time;
      material.uniforms.uScrollAmount.value = scroll;
      material.uniforms.uWavelength.value = params.wavelength;
      material.uniforms.uAmplitude.value = params.amplitude;
      material.uniforms.uScrollIntensity.value = params.scrollIntensity;
      material.uniforms.uCurveWidth.value = params.curveWidth;
      material.uniforms.uSunGlow.value = params.sunGlow;
      material.uniforms.uSunScroll.value = params.sunScroll;
      material.uniforms.uSunOpacity.value = params.sunOpacityTop;
    },
    resize(viewW, viewH) {
      const sunH = viewH * 0.5;
      mesh.scale.set(viewW, sunH, 1);
      mesh.position.set(0, viewH * 0.5 - sunH * 0.5, 0);
      material.uniforms.uRibbonScale.value = (viewH * 0.18) / Math.max(sunH, 0.0001);
    },
    dispose() {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
