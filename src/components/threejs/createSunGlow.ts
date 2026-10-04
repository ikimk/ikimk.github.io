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
  uniform float uSunGlow;
  uniform float uSunScroll;
  uniform float uSunOpacity;
  varying vec2 vUv;

  void main() {
    float x = vUv.x;
    float t = uTime;
    float scroll = uScrollAmount;

    // straight top edge — no ribbon / wave
    float above = max(vUv.y, 0.0);

    float glowAmt = uSunGlow + sin(t * 0.85) * 0.1;
    float breath = 0.9 + 0.1 * sin(t * 0.7 + x * 2.4);
    float crest = 0.85 + 0.15 * sin(t * 0.5);
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

/** SunGlow-only params — never shared with StarlightRibbon */
export type SunGlowParams = {
  sun_glow: number;
  sun_glow_on_scroll: number;
  sun_opacity: number;
};

export type SunGlowEffect = {
  update: (time: number, scroll: number, params: SunGlowParams) => void;
  resize: (viewW: number, viewH: number) => void;
  dispose: () => void;
};

export function createSunGlow(scene: THREE.Scene, defaults?: Partial<SunGlowParams>): SunGlowEffect {
  const sun_glow = defaults?.sun_glow ?? 0.6;
  const sun_glow_on_scroll = defaults?.sun_glow_on_scroll ?? 0.35;
  const sun_opacity = defaults?.sun_opacity ?? 0.4;

  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollAmount: { value: 0 },
      uSunGlow: { value: sun_glow },
      uSunScroll: { value: sun_glow_on_scroll },
      uSunOpacity: { value: sun_opacity },
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
      material.uniforms.uSunGlow.value = params.sun_glow;
      material.uniforms.uSunScroll.value = params.sun_glow_on_scroll;
      material.uniforms.uSunOpacity.value = params.sun_opacity;
    },
    resize(viewW, viewH) {
      const sunH = viewH * 0.5;
      mesh.scale.set(viewW, sunH, 1);
      mesh.position.set(0, viewH * 0.5 - sunH * 0.5, 0);
    },
    dispose() {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
