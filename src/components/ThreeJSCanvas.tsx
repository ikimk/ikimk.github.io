'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPSGrid } from '@/components/threejs/createPSGrid';
import { createStarlightRibbon } from '@/components/threejs/createStarlightRibbon';
import { createSunGlow } from '@/components/threejs/createSunGlow';
import {
  LerpEase,
  PSGRID_DEFAULTS,
  RecoverLerp,
  STARLIGHT_DEFAULTS,
  SUNGLOW_DEFAULTS,
  THREEJS_PANEL_DEFAULTS,
  type ThreeJSPanelParams,
} from '@/components/threejs/threeJSControls';

function ControlSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="three-js-canvas-controls-section flex flex-col gap-[8px]">
      <button
        type="button"
        className="three-js-canvas-controls-section-toggle flex w-full items-center justify-between text-left text-[11px] font-[600] uppercase tracking-[0.06em] text-[#ffffff66]"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <div className="three-js-canvas-controls-section-body flex flex-col gap-[10px]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

type ThreeJSCanvasProps = {
  /** Debug panel — on for `/test`, off for production pages */
  showControls?: boolean;
  /** Top edge sun (playground). Homepage Figma uses bottom ribbon only. */
  includeSunGlow?: boolean;
  /** Full-screen PSGrid wallpaper behind edge effects */
  includePSGrid?: boolean;
  /** Override PSGrid glyph color (hex). Default: ThreeColorPSGridGlyph */
  psGridGlyphColor?: string;
  /** Override PSGrid opacity at rest / on scroll */
  psGridOpacity?: number;
  psGridOpacityTo?: number;
};

export default function ThreeJSCanvas({
  showControls = true,
  includeSunGlow = true,
  includePSGrid = true,
  psGridGlyphColor,
  psGridOpacity,
  psGridOpacityTo,
}: ThreeJSCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelDefaults: ThreeJSPanelParams = {
    ...THREEJS_PANEL_DEFAULTS,
    ...(psGridOpacity != null ? { opacity: psGridOpacity } : {}),
    ...(psGridOpacityTo != null ? { opacity_to: psGridOpacityTo } : {}),
  };
  const paramsRef = useRef({ ...panelDefaults });
  const [params, setParams] = useState({ ...panelDefaults });
  const [controlsOpen, setControlsOpen] = useState(false);

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

    const psGridDefaults = {
      ...PSGRID_DEFAULTS,
      ...(psGridOpacity != null ? { opacity: psGridOpacity } : {}),
      ...(psGridOpacityTo != null ? { opacity_to: psGridOpacityTo } : {}),
    };

    // shared-canvas effects only — GradientCloud kept for later (not mounted here)
    // FilmGrain is opt-in GLSL on selected effects (currently StarlightRibbon only)
    const psGrid = includePSGrid
      ? createPSGrid(
          scene,
          psGridDefaults,
          psGridGlyphColor ? { glyph: psGridGlyphColor } : undefined,
        )
      : null;
    const sunGlow = includeSunGlow
      ? createSunGlow(scene, SUNGLOW_DEFAULTS)
      : null;
    const starlightRibbon = createStarlightRibbon(scene, STARLIGHT_DEFAULTS);

    const clock = new THREE.Clock();

    function FitToScreen() {
      const dist = camera.position.z;
      const viewH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
      const viewW = viewH * camera.aspect;
      psGrid?.resize(viewW, viewH, WindowWidth, WindowHeight);
      sunGlow?.resize(viewW, viewH);
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
      if (psGrid) {
        psGrid.update(time, scrollCurrent, {
          scale: p.scale,
          glyph_size: p.glyph_size,
          stroke: p.stroke,
          opacity: p.opacity,
          opacity_to: p.opacity_to,
          noise_scale: p.noise_scale,
          noise_amount: p.noise_amount,
          noise_speed: p.noise_speed,
          glyph_speed: p.glyph_speed,
          size_min: p.size_min,
          bend: p.bend,
          bend_to: p.bend_to,
          fade_top: p.fade_top,
        });
      }
      if (sunGlow) {
        sunGlow.update(time, scrollCurrent, {
          sun_glow: p.sun_glow,
          sun_glow_on_scroll: p.sun_glow_on_scroll,
          sun_opacity: p.sun_opacity,
        });
      }

      // Starlight FilmGrain only — animates grain_intensity → grain_intensity_to
      starlightRibbon.update(time, scrollCurrent, {
        wavelength: p.wavelength,
        amplitude: p.amplitude,
        scroll_intensity: p.scroll_intensity,
        curve_width: p.curve_width,
        ribbon_sun_glow: p.ribbon_sun_glow,
        ribbon_sun_on_scroll: p.ribbon_sun_on_scroll,
        ribbon_sun_opacity: p.ribbon_sun_opacity,
        wave_offset_y: p.wave_offset_y,
        grain_intensity: p.grain_intensity,
        grain_intensity_to: p.grain_intensity_to,
      });

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
      psGrid?.dispose();
      sunGlow?.dispose();
      starlightRibbon.dispose();
      renderer.dispose();
    };
  }, [
    includeSunGlow,
    includePSGrid,
    psGridGlyphColor,
    psGridOpacity,
    psGridOpacityTo,
  ]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="ThreeJSCanvas pointer-events-none absolute top-[0px] left-[0px] z-[1] h-[100vh] w-[100vw]"
      />
      {showControls ? (
      <div className="three-js-canvas-controls pointer-events-auto absolute top-[16px] right-[16px] z-[3] flex flex-col items-end gap-[8px]">
        <button
          type="button"
          className="three-js-canvas-controls-toggle rounded-[10px] bg-[#111111cc] px-[12px] py-[8px] text-[12px] font-[600] leading-[16px] text-[#ffffff]"
          onClick={() => setControlsOpen((open) => !open)}
          aria-expanded={controlsOpen}
        >
          {controlsOpen ? 'Hide controls' : 'Controls'}
        </button>
        {controlsOpen ? (
          <div className="three-js-canvas-controls-panel flex max-h-[calc(100vh-72px)] w-[240px] flex-col gap-[10px] overflow-y-auto rounded-[12px] bg-[#111111cc] p-[14px] text-[#ffffff]">
            <ControlSection title="PSGrid">
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  scale {params.scale.toFixed(0)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="6"
                  max="28"
                  step="1"
                  value={params.scale}
                  onChange={(e) => setParam('scale', Number(e.target.value))}
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  glyph_size {params.glyph_size.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0.08"
                  max="0.28"
                  step="0.01"
                  value={params.glyph_size}
                  onChange={(e) =>
                    setParam('glyph_size', Number(e.target.value))
                  }
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  stroke {params.stroke.toFixed(3)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0.01"
                  max="0.08"
                  step="0.002"
                  value={params.stroke}
                  onChange={(e) => setParam('stroke', Number(e.target.value))}
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  opacity {params.opacity.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.opacity}
                  onChange={(e) => setParam('opacity', Number(e.target.value))}
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  opacity_to {params.opacity_to.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.opacity_to}
                  onChange={(e) =>
                    setParam('opacity_to', Number(e.target.value))
                  }
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  noise_scale {params.noise_scale.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0.02"
                  max="0.40"
                  step="0.01"
                  value={params.noise_scale}
                  onChange={(e) =>
                    setParam('noise_scale', Number(e.target.value))
                  }
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  noise_amount {params.noise_amount.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.noise_amount}
                  onChange={(e) =>
                    setParam('noise_amount', Number(e.target.value))
                  }
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  noise_speed {params.noise_speed.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={params.noise_speed}
                  onChange={(e) =>
                    setParam('noise_speed', Number(e.target.value))
                  }
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  glyph_speed {params.glyph_speed.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0"
                  max="1.2"
                  step="0.01"
                  value={params.glyph_speed}
                  onChange={(e) =>
                    setParam('glyph_speed', Number(e.target.value))
                  }
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  size_min {params.size_min.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0.02"
                  max="0.50"
                  step="0.01"
                  value={params.size_min}
                  onChange={(e) =>
                    setParam('size_min', Number(e.target.value))
                  }
                />
              </label>
              <label className="three-js-canvas-control flex flex-col gap-[4px]">
                <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                  fade_top {params.fade_top.toFixed(2)}
                </span>
                <input
                  className="three-js-canvas-control-input w-full"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.fade_top}
                  onChange={(e) =>
                    setParam('fade_top', Number(e.target.value))
                  }
                />
              </label>
              <ControlSection title="Bend">
                <label className="three-js-canvas-control flex flex-col gap-[4px]">
                  <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                    bend {params.bend.toFixed(2)}
                  </span>
                  <input
                    className="three-js-canvas-control-input w-full"
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={params.bend}
                    onChange={(e) => setParam('bend', Number(e.target.value))}
                  />
                </label>
                <label className="three-js-canvas-control flex flex-col gap-[4px]">
                  <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                    bend_to {params.bend_to.toFixed(2)}
                  </span>
                  <input
                    className="three-js-canvas-control-input w-full"
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={params.bend_to}
                    onChange={(e) =>
                      setParam('bend_to', Number(e.target.value))
                    }
                  />
                </label>
              </ControlSection>
            </ControlSection>
            <ControlSection title="StarlightRibbon">
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                wave_offset_y {params.wave_offset_y}px
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="-40"
                max="80"
                step="1"
                value={params.wave_offset_y}
                onChange={(e) => setParam('wave_offset_y', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                wavelength {params.wavelength.toFixed(2)}
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
                amplitude {params.amplitude.toFixed(3)}
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
                scroll_intensity {params.scroll_intensity.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="3"
                step="0.05"
                value={params.scroll_intensity}
                onChange={(e) => setParam('scroll_intensity', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                curve_width {params.curve_width.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={params.curve_width}
                onChange={(e) => setParam('curve_width', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                ribbon_sun_glow {params.ribbon_sun_glow.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="2"
                step="0.02"
                value={params.ribbon_sun_glow}
                onChange={(e) => setParam('ribbon_sun_glow', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                ribbon_sun_on_scroll {params.ribbon_sun_on_scroll.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="3"
                step="0.05"
                value={params.ribbon_sun_on_scroll}
                onChange={(e) => setParam('ribbon_sun_on_scroll', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                ribbon_sun_opacity {params.ribbon_sun_opacity.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={params.ribbon_sun_opacity}
                onChange={(e) => setParam('ribbon_sun_opacity', Number(e.target.value))}
              />
            </label>
            </ControlSection>

            <ControlSection title="FilmGrain">
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                grain_intensity {params.grain_intensity.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="0.45"
                step="0.01"
                value={params.grain_intensity}
                onChange={(e) => setParam('grain_intensity', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                grain_intensity_to {params.grain_intensity_to.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="0.45"
                step="0.01"
                value={params.grain_intensity_to}
                onChange={(e) =>
                  setParam('grain_intensity_to', Number(e.target.value))
                }
              />
            </label>
            </ControlSection>

            <ControlSection title="SunGlow">
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                sun_glow {params.sun_glow.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="2"
                step="0.02"
                value={params.sun_glow}
                onChange={(e) => setParam('sun_glow', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                sun_glow_on_scroll {params.sun_glow_on_scroll.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="3"
                step="0.05"
                value={params.sun_glow_on_scroll}
                onChange={(e) => setParam('sun_glow_on_scroll', Number(e.target.value))}
              />
            </label>
            <label className="three-js-canvas-control flex flex-col gap-[4px]">
              <span className="three-js-canvas-control-label text-[12px] leading-[16px] text-[#ffffffcc]">
                sun_opacity {params.sun_opacity.toFixed(2)}
              </span>
              <input
                className="three-js-canvas-control-input w-full"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={params.sun_opacity}
                onChange={(e) => setParam('sun_opacity', Number(e.target.value))}
              />
            </label>
            </ControlSection>
          </div>
        ) : null}
      </div>
      ) : null}
    </>
  );
}
