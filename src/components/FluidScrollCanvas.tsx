'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LerpEase = 0.07;
const RecoverLerp = 0.05;

const JellyInitialWave = 0.06;
const JellyDisplace = 0.55;

const jellyVertexShader = `
  uniform float uScrollAmount;
  uniform float uInitialWave;
  uniform float uDisplace;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float PI = 3.1415926535897;

    // scroll down (+Z), scroll up (−Z)
    float wave = sin(PI * uv.x) * sin(PI * uv.y);
    pos.z += wave * uInitialWave + wave * uDisplace * uScrollAmount;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Light fluid — 2 noise octaves, no bubble loop, no blur kernel
const jellyFragmentShader = `
  uniform float uTime;
  uniform float uAspect;
  uniform float uScrollAmount;
  varying vec2 vUv;

  const vec3 COL_A = vec3(1.0, 0.125490196, 0.125490196);
  const vec3 COL_B = vec3(1.0, 0.42, 0.22);
  const vec3 COL_C = vec3(0.42, 0.08, 0.1);

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  vec3 palette(float x) {
    float t = smoothstep(0.0, 1.0, clamp(x, 0.0, 1.0));
    vec3 c = mix(COL_C, COL_A, smoothstep(0.0, 0.65, t));
    return mix(c, COL_B, smoothstep(0.35, 1.0, t));
  }

  void main() {
    float scroll = uScrollAmount;
    vec2 uv = vec2((vUv.x - 0.5) * max(uAspect, 1.0) * 0.22 + 0.5, vUv.y);

    float n = noise(uv * 3.2 + vec2(uTime * 0.04, scroll * 0.2));
    float n2 = noise(uv * 6.0 - n + scroll * 0.15);

    vec2 warp = uv;
    warp.x += (n - 0.5) * (0.18 + abs(scroll) * 0.22) + scroll * 0.08;
    warp.y += (n2 - 0.5) * (0.12 + abs(scroll) * 0.1);

    float ang = scroll * 0.6;
    vec2 c = warp - 0.5;
    float s = sin(ang);
    float co = cos(ang);
    c = mat2(co, -s, s, co) * c;
    warp = c + 0.5;

    float field = noise(warp * 2.4 + n2);
    vec3 color = palette(field * 0.7 + n * 0.3);

    float alpha = 1.0 - smoothstep(0.45, 1.0, vUv.y);
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function FluidScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let WindowWidth = window.innerWidth;
    let WindowHeight = window.innerHeight;
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let animationFrameId = 0;
    let running = false;

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

    const jellyGeometry = new THREE.PlaneGeometry(1, 1, 24, 8);
    const jellyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: 1 },
        uScrollAmount: { value: 0 },
        uInitialWave: { value: JellyInitialWave },
        uDisplace: { value: JellyDisplace },
      },
      vertexShader: jellyVertexShader,
      fragmentShader: jellyFragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const JellyBox = new THREE.Mesh(jellyGeometry, jellyMaterial);
    scene.add(JellyBox);

    const clock = new THREE.Clock();

    function FitToScreen() {
      const dist = camera.position.z;
      const viewH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
      const viewW = viewH * camera.aspect;
      const jellyH = viewH * 0.18;
      JellyBox.scale.set(viewW, jellyH, 1);
      JellyBox.position.set(0, -viewH * 0.5 + jellyH * 0.5, 0);
      jellyMaterial.uniforms.uAspect.value = viewW / Math.max(jellyH, 0.0001);
    }
    FitToScreen();

    function renderFrame() {
      scrollTarget += (0 - scrollTarget) * RecoverLerp;
      scrollCurrent = scrollCurrent * (1 - LerpEase) + scrollTarget * LerpEase;

      jellyMaterial.uniforms.uScrollAmount.value = scrollCurrent;
      jellyMaterial.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);

      const idle =
        Math.abs(scrollTarget) < 0.002 && Math.abs(scrollCurrent) < 0.002;
      if (idle) {
        running = false;
        return;
      }
      animationFrameId = requestAnimationFrame(renderFrame);
    }

    function startLoop() {
      if (running) return;
      running = true;
      animationFrameId = requestAnimationFrame(renderFrame);
    }

    function onWheel(event: WheelEvent) {
      scrollTarget += event.deltaY * 0.004;
      scrollTarget = THREE.MathUtils.clamp(scrollTarget, -1, 1);
      startLoop();
    }

    function onResize() {
      WindowWidth = window.innerWidth;
      WindowHeight = window.innerHeight;
      renderer.setSize(WindowWidth, WindowHeight);
      camera.aspect = WindowWidth / WindowHeight;
      camera.updateProjectionMatrix();
      FitToScreen();
      renderer.render(scene, camera);
    }

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('resize', onResize);
    renderer.render(scene, camera);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      jellyGeometry.dispose();
      jellyMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="FluidScrollCanvas absolute inset-[0px] z-[1] h-full w-full"
    />
  );
}
