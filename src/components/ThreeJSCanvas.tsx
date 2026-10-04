'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createStarlightRibbon } from '@/components/threejs/createStarlightRibbon';
import { createSunGlow } from '@/components/threejs/createSunGlow';
import type { FilmGrainParams } from '@/components/threejs/createFilmGrain';
import {
  LerpEase,
  RecoverLerp,
  STARLIGHT_DEFAULTS,
  SUNGLOW_DEFAULTS,
  THREEJS_PANEL_DEFAULTS,
  type ThreeJSPanelParams,
} from '@/components/threejs/threeJSControls';

export default function ThreeJSCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ ...THREEJS_PANEL_DEFAULTS });
  const [params, setParams] = useState({ ...THREEJS_PANEL_DEFAULTS });

  function setParam(key: keyof ThreeJSPanelParams, value: number) {
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

    // separate components — each gets only its own params
    // FilmGrain is opt-in GLSL on selected effects (currently StarlightRibbon only)
    const sunGlow = createSunGlow(scene, SUNGLOW_DEFAULTS);
    const starlightRibbon = createStarlightRibbon(scene, STARLIGHT_DEFAULTS);

    const clock = new THREE.Clock();

    function FitToScreen() {
      const dist = camera.position.z;
      const viewH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
      const viewW = viewH * camera.aspect;
      sunGlow.resize(viewW, viewH);
      starlightRibbon.resize(viewW, viewH, WindowHeight);
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
      const filmGrain: FilmGrainParams = { intensity: p.grainIntensity };

      sunGlow.update(time, scrollCurrent, {
        sunGlow: p.sunGlowTop,
        sunScroll: p.sunScrollTop,
        sunOpacity: p.sunOpacityTop,
      });

      // FilmGrain opt-in: StarlightRibbon only (add other effects here when selected)
      starlightRibbon.update(
        time,
        scrollCurrent,
        {
          wavelength: p.wavelength,
          amplitude: p.amplitude,
          scrollIntensity: p.scrollIntensity,
          curveWidth: p.curveWidth,
          sunGlow: p.sunGlow,
          sunScroll: p.sunScroll,
          sunOpacity: p.sunOpacity,
          waveOffsetY: p.waveOffsetY,
        },
        filmGrain,
      );

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
      sunGlow.dispose();
      starlightRibbon.dispose();
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
        <p className="three-js-canvas-controls-group text-[11px] font-[600] uppercase tracking-[0.06em] text-[#ffffff66]">
          StarlightRibbon
        </p>
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
            Ribbon sun glow {params.sunGlow.toFixed(2)}
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
            Ribbon sun on scroll {params.sunScroll.toFixed(2)}
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
            Ribbon sun opacity {params.sunOpacity.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.sunOpacity}
            onChange={(e) => setParam('sunOpacity', Number(e.target.value))}
          />
        </label>

        <p className="three-js-canvas-controls-group mt-[8px] text-[11px] font-[600] uppercase tracking-[0.06em] text-[#ffffff66]">
          FilmGrain
        </p>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Grain intensity {params.grainIntensity.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="0.35"
            step="0.01"
            value={params.grainIntensity}
            onChange={(e) => setParam('grainIntensity', Number(e.target.value))}
          />
        </label>

        <p className="three-js-canvas-controls-group mt-[8px] text-[11px] font-[600] uppercase tracking-[0.06em] text-[#ffffff66]">
          SunGlow
        </p>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun glow {params.sunGlowTop.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="2"
            step="0.02"
            value={params.sunGlowTop}
            onChange={(e) => setParam('sunGlowTop', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun glow on scroll {params.sunScrollTop.toFixed(2)}
          </span>
          <input
            className="three-js-canvas-control-input w-full"
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={params.sunScrollTop}
            onChange={(e) => setParam('sunScrollTop', Number(e.target.value))}
          />
        </label>
        <label className="three-js-canvas-control flex flex-col gap-[4px]">
          <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
            Sun opacity {params.sunOpacityTop.toFixed(2)}
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
      </div>
    </>
  );
}
