'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const siriVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LerpEase = 0.07;
const RecoverLerp = 0.05;

const DEFAULTS = {
  edgeHeight: 0.07,
  wavelength: 0.7,
  amplitude: 0.018,
  scrollIntensity: 0.9,
  curveWidth: 0.12,
  sunGlow: 0.6,
  sunScroll: 0.35,
};

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

const siriFragmentShader = `
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

    // fill under the U, down to the screen edge
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

const sunGlowFragmentShader = `
  uniform float uTime;
  uniform float uScrollAmount;
  uniform float uEdgeHeight;
  uniform float uWavelength;
  uniform float uAmplitude;
  uniform float uScrollIntensity;
  uniform float uCurveWidth;
  uniform float uSunGlow;
  uniform float uSunScroll;
  uniform float uRibbonScale;
  varying vec2 vUv;

  ${waveYGlsl}

  void main() {
    float x = vUv.x;
    float t = uTime;
    float scroll = uScrollAmount;

    // same wave as ribbon, mapped into this taller plane's UV
    float y0 = waveY(x, t, scroll) * uRibbonScale;
    float above = vUv.y - y0;
    if (above < -0.004) {
      gl_FragColor = vec4(0.0);
      return;
    }
    above = max(above, 0.0);

    // always-on horizon: soft orange sky sitting on the wave
    float glowAmt = uSunGlow + sin(t * 0.85) * 0.1;
    float breath = 0.9 + 0.1 * sin(t * 0.7 + x * 2.4);
    float crest = 0.85 + 0.15 * sin(x * 6.2831853 / max(uWavelength, 0.15) - t * 0.5);
    float baseRise = exp(-above * 6.2);
    float baseHalo = exp(-above * 2.15) * 0.7;
    float baseStrength = glowAmt * breath * crest * (baseRise + baseHalo);

    // extra height + brightness only while scrolling
    float scrollPush = abs(scroll) * uSunScroll;
    float scrollTight = mix(6.0, 1.8, clamp(scrollPush, 0.0, 1.5) / 1.5);
    float scrollRise = exp(-above * scrollTight);
    float scrollHalo = exp(-above * scrollTight * 0.32) * 0.75;
    float scrollStrength = glowAmt * scrollPush * (scrollRise * 0.7 + scrollHalo);

    float sunStrength = baseStrength + scrollStrength;

    // orange haze, yellow closer to the wave
    vec3 sunOrange = vec3(1.0, 0.32, 0.04);
    vec3 sunYellow = vec3(1.0, 0.78, 0.12);
    float heat = clamp(baseRise * 0.9 + scrollRise * scrollPush * 0.35, 0.0, 1.0);
    vec3 sunCol = mix(sunOrange, sunYellow, heat * 0.85);

    gl_FragColor = vec4(sunCol * sunStrength, clamp(sunStrength, 0.0, 1.0));
  }
`;

function makeWaveUniforms() {
  return {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uScrollAmount: { value: 0 },
    uEdgeHeight: { value: DEFAULTS.edgeHeight },
    uWavelength: { value: DEFAULTS.wavelength },
    uAmplitude: { value: DEFAULTS.amplitude },
    uScrollIntensity: { value: DEFAULTS.scrollIntensity },
    uCurveWidth: { value: DEFAULTS.curveWidth },
  };
}

export default function SiriWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ ...DEFAULTS });
  const [params, setParams] = useState({ ...DEFAULTS });

  function setParam(key: keyof typeof DEFAULTS, value: number) {
    paramsRef.current[key] = value;
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let WindowWidth = window.innerWidth;
    let WindowHeight = window.innerHeight;
    let scrollTarget = 0;
    let scrollCurrent = 0;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(1);
    renderer.setSize(WindowWidth, WindowHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const camera = new THREE.PerspectiveCamera(
      50,
      WindowWidth / WindowHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 6.5);
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ...makeWaveUniforms(),
        uSunGlow: { value: DEFAULTS.sunGlow },
        uSunScroll: { value: DEFAULTS.sunScroll },
        uRibbonScale: { value: 0.18 / 0.5 },
      },
      vertexShader: siriVertexShader,
      fragmentShader: sunGlowFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const SunPlane = new THREE.Mesh(geometry, sunMaterial);
    SunPlane.renderOrder = 0;
    scene.add(SunPlane);

    const ribbonMaterial = new THREE.ShaderMaterial({
      uniforms: makeWaveUniforms(),
      vertexShader: siriVertexShader,
      fragmentShader: siriFragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const WavePlane = new THREE.Mesh(geometry, ribbonMaterial);
    WavePlane.renderOrder = 1;
    scene.add(WavePlane);

    const clock = new THREE.Clock();

    function FitToScreen() {
      const dist = camera.position.z;
      const viewH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
      const viewW = viewH * camera.aspect;
      const waveH = viewH * 0.18;
      const sunH = viewH * 0.5;

      WavePlane.scale.set(viewW, waveH, 1);
      WavePlane.position.set(0, -viewH * 0.5 + waveH * 0.5, 0);
      ribbonMaterial.uniforms.uAspect.value = viewW / Math.max(waveH, 0.0001);

      SunPlane.scale.set(viewW, sunH, 1);
      SunPlane.position.set(0, -viewH * 0.5 + sunH * 0.5, -0.01);
      sunMaterial.uniforms.uRibbonScale.value = waveH / Math.max(sunH, 0.0001);
    }
    FitToScreen();

    function onWheel(event: WheelEvent) {
      scrollTarget += event.deltaY * 0.004;
      scrollTarget = THREE.MathUtils.clamp(scrollTarget, -1, 1);
    }
    window.addEventListener('wheel', onWheel, { passive: true });

    function SyncUniforms(mat: THREE.ShaderMaterial, time: number, scroll: number) {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uScrollAmount.value = scroll;
      mat.uniforms.uEdgeHeight.value = paramsRef.current.edgeHeight;
      mat.uniforms.uWavelength.value = paramsRef.current.wavelength;
      mat.uniforms.uAmplitude.value = paramsRef.current.amplitude;
      mat.uniforms.uScrollIntensity.value = paramsRef.current.scrollIntensity;
      mat.uniforms.uCurveWidth.value = paramsRef.current.curveWidth;
    }

    let animationFrameId = 0;
    function AnimationLoop() {
      scrollTarget += (0 - scrollTarget) * RecoverLerp;
      scrollCurrent =
        scrollCurrent * (1 - LerpEase) + scrollTarget * LerpEase;

      const time = clock.getElapsedTime();
      SyncUniforms(ribbonMaterial, time, scrollCurrent);
      SyncUniforms(sunMaterial, time, scrollCurrent);
      sunMaterial.uniforms.uSunGlow.value = paramsRef.current.sunGlow;
      sunMaterial.uniforms.uSunScroll.value = paramsRef.current.sunScroll;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(AnimationLoop);
    }
    AnimationLoop();

    function onResize() {
      WindowWidth = window.innerWidth;
      WindowHeight = window.innerHeight;
      renderer.setSize(WindowWidth, WindowHeight);
      camera.aspect = WindowWidth / WindowHeight;
      camera.updateProjectionMatrix();
      FitToScreen();
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      ribbonMaterial.dispose();
      sunMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="SiriWaveCanvas absolute inset-[0px] z-[1] h-full w-full"
      />
      <div className="siri-wave-canvas-controls pointer-events-auto absolute top-[16px] right-[16px] z-[3] flex w-[240px] flex-col gap-[10px] rounded-[12px] bg-[#111111cc] p-[14px] text-[#ffffff]">
        <label className="siri-wave-canvas-control flex flex-col gap-[4px]">
          <span className="siri-wave-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Edge height {params.edgeHeight.toFixed(2)}
          </span>
          <input
            className="siri-wave-canvas-control-input w-full"
            type="range"
            min="0"
            max="0.8"
            step="0.01"
            value={params.edgeHeight}
            onChange={(e) => setParam('edgeHeight', Number(e.target.value))}
          />
        </label>
        <label className="siri-wave-canvas-control flex flex-col gap-[4px]">
          <span className="siri-wave-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Wavelength {params.wavelength.toFixed(2)}
          </span>
          <input
            className="siri-wave-canvas-control-input w-full"
            type="range"
            min="0.3"
            max="4"
            step="0.05"
            value={params.wavelength}
            onChange={(e) => setParam('wavelength', Number(e.target.value))}
          />
        </label>
        <label className="siri-wave-canvas-control flex flex-col gap-[4px]">
          <span className="siri-wave-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Amplitude {params.amplitude.toFixed(3)}
          </span>
          <input
            className="siri-wave-canvas-control-input w-full"
            type="range"
            min="0"
            max="0.2"
            step="0.002"
            value={params.amplitude}
            onChange={(e) => setParam('amplitude', Number(e.target.value))}
          />
        </label>
        <label className="siri-wave-canvas-control flex flex-col gap-[4px]">
          <span className="siri-wave-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Scroll intensity {params.scrollIntensity.toFixed(2)}
          </span>
          <input
            className="siri-wave-canvas-control-input w-full"
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={params.scrollIntensity}
            onChange={(e) => setParam('scrollIntensity', Number(e.target.value))}
          />
        </label>
        <label className="siri-wave-canvas-control flex flex-col gap-[4px]">
          <span className="siri-wave-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Curve width {params.curveWidth.toFixed(2)}
          </span>
          <input
            className="siri-wave-canvas-control-input w-full"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.curveWidth}
            onChange={(e) => setParam('curveWidth', Number(e.target.value))}
          />
        </label>
        <label className="siri-wave-canvas-control flex flex-col gap-[4px]">
          <span className="siri-wave-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun glow {params.sunGlow.toFixed(2)}
          </span>
          <input
            className="siri-wave-canvas-control-input w-full"
            type="range"
            min="0"
            max="2"
            step="0.02"
            value={params.sunGlow}
            onChange={(e) => setParam('sunGlow', Number(e.target.value))}
          />
        </label>
        <label className="siri-wave-canvas-control flex flex-col gap-[4px]">
          <span className="siri-wave-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun glow on scroll {params.sunScroll.toFixed(2)}
          </span>
          <input
            className="siri-wave-canvas-control-input w-full"
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={params.sunScroll}
            onChange={(e) => setParam('sunScroll', Number(e.target.value))}
          />
        </label>
      </div>
    </>
  );
}
