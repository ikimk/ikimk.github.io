'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createPinkSunriseGlassEffect,
  PINK_SUNRISE_GLASS_SHADER_REV,
  type PinkSunriseGlassEffectParams,
} from '@/components/threejs/createPinkSunriseGlassEffect';
import {
  PINK_SUNRISE_GLASS_DEFAULTS,
  pinkSunriseGlassLive,
} from '@/components/threejs/threeJSControls';
import { ColorBlackDarkest } from '@/utils/DesignSystem';

type PinkSunriseGlassEffectProps = {
  className?: string;
  params?: Partial<PinkSunriseGlassEffectParams>;
};

/**
 * PinkSunriseGlassEffect — own WebGL canvas, fills parent.
 * Sun at the bottom spreading pink / orange light through vertical reeded glass.
 */
export default function PinkSunriseGlassEffect({
  className = '',
  params,
}: PinkSunriseGlassEffectProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const defaults = { ...PINK_SUNRISE_GLASS_DEFAULTS, ...params };

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(new THREE.Color(ColorBlackDarkest), 1);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 6.5);
    camera.lookAt(0, 0, 0);

    const effect = createPinkSunriseGlassEffect(scene, defaults);
    const clock = new THREE.Clock();

    function FitToContainer() {
      const w = Math.max(1, wrap!.clientWidth);
      const h = Math.max(1, wrap!.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const dist = camera.position.z;
      const viewH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
      const viewW = viewH * camera.aspect;
      effect.resize(viewW, viewH);
    }
    FitToContainer();

    const ro = new ResizeObserver(() => FitToContainer());
    ro.observe(wrap);

    let animationFrameId = 0;
    function AnimationLoop() {
      effect.update(clock.getElapsedTime(), {
        speed: pinkSunriseGlassLive.speed,
        opacity: defaults.opacity,
        ribs: pinkSunriseGlassLive.ribs,
        glass: pinkSunriseGlassLive.glass,
        spread: pinkSunriseGlassLive.spread,
        wave: pinkSunriseGlassLive.wave,
        core: defaults.core,
        orange: defaults.orange,
        coral: defaults.coral,
        pink: defaults.pink,
        lavender: defaults.lavender,
        mist: defaults.mist,
      });
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(AnimationLoop);
    }
    AnimationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      effect.dispose();
      renderer.dispose();
    };
  }, [JSON.stringify(params), PINK_SUNRISE_GLASS_SHADER_REV]);

  return (
    <div
      ref={wrapRef}
      className={`PinkSunriseGlassEffect absolute inset-[0px] h-full w-full overflow-hidden ${className}`.trim()}
      style={{ backgroundColor: ColorBlackDarkest }}
    >
      <canvas
        ref={canvasRef}
        className="pink-sunrise-glass-effect-canvas pointer-events-none absolute inset-[0px] h-full w-full"
        style={{ backgroundColor: ColorBlackDarkest }}
      />
    </div>
  );
}
