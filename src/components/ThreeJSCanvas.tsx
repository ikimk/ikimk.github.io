'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createSiriRibbon } from '@/components/threejs/createSiriRibbon';
import { createTopSunGlow } from '@/components/threejs/createTopSunGlow';

const LerpEase = 0.07;
const RecoverLerp = 0.05;

const DEFAULTS = {
  wavelength: 0.85,
  amplitude: 0.018,
  scrollIntensity: 0.9,
  curveWidth: 0.12,
  sunGlow: 0.6,
  sunScroll: 0.35,
  sunOpacityTop: 0.4,
  sunOpacityBottom: 0.6,
  waveOffsetY: -5,
};

export default function ThreeJSCanvas() {
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

    // one canvas — effects live in separate files
    const topSunGlow = createTopSunGlow(scene);
    const siriRibbon = createSiriRibbon(scene, DEFAULTS);

    const clock = new THREE.Clock();

    function FitToScreen() {
      const dist = camera.position.z;
      const viewH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
      const viewW = viewH * camera.aspect;
      topSunGlow.resize(viewW, viewH);
      siriRibbon.resize(viewW, viewH, WindowHeight);
    }
    FitToScreen();

    function onWheel(event: WheelEvent) {
      scrollTarget += event.deltaY * 0.004;
      scrollTarget = THREE.MathUtils.clamp(scrollTarget, -1, 1);
    }
    window.addEventListener('wheel', onWheel, { passive: true });

    let animationFrameId = 0;
    function AnimationLoop() {
      scrollTarget += (0 - scrollTarget) * RecoverLerp;
      scrollCurrent =
        scrollCurrent * (1 - LerpEase) + scrollTarget * LerpEase;

      const time = clock.getElapsedTime();
      const p = paramsRef.current;
      topSunGlow.update(time, scrollCurrent, p);
      siriRibbon.update(time, scrollCurrent, p);
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
      topSunGlow.dispose();
      siriRibbon.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="ThreeJSCanvas pointer-events-none absolute top-[0px] left-[0px] z-[1] h-[100vh] w-[100vw]"
      />
      <div className="three-js-canvas-controls pointer-events-auto absolute top-[16px] right-[16px] z-[3] flex w-[240px] flex-col gap-[10px] rounded-[12px] bg-[#111111cc] p-[14px] text-[#ffffff]">
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Wave offset Y {params.waveOffsetY}px
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="-40"
            max="80"
            step="1"
            value={params.waveOffsetY}
            onChange={(e) => setParam('waveOffsetY', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Wavelength {params.wavelength.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0.3"
            max="4"
            step="0.05"
            value={params.wavelength}
            onChange={(e) => setParam('wavelength', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Amplitude {params.amplitude.toFixed(3)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="0.2"
            step="0.002"
            value={params.amplitude}
            onChange={(e) => setParam('amplitude', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Scroll intensity {params.scrollIntensity.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={params.scrollIntensity}
            onChange={(e) => setParam('scrollIntensity', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Curve width {params.curveWidth.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.curveWidth}
            onChange={(e) => setParam('curveWidth', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun glow {params.sunGlow.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="2"
            step="0.02"
            value={params.sunGlow}
            onChange={(e) => setParam('sunGlow', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun glow on scroll {params.sunScroll.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={params.sunScroll}
            onChange={(e) => setParam('sunScroll', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun opacity top {params.sunOpacityTop.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.sunOpacityTop}
            onChange={(e) => setParam('sunOpacityTop', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun opacity bottom {params.sunOpacityBottom.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.sunOpacityBottom}
            onChange={(e) => setParam('sunOpacityBottom', Number(e.target.value))}
          />
        </label>
      </div>
    </>
  );
}
