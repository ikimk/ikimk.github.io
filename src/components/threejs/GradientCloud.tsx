'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createGradientCloud,
  type GradientCloudParams,
} from '@/components/threejs/createGradientCloud';
import { GRADIENTCLOUD_DEFAULTS, gradientCloudLive } from '@/components/threejs/threeJSControls';

type GradientCloudProps = {
  className?: string;
  params?: Partial<GradientCloudParams>;
};

/**
 * GradientCloud — own WebGL canvas, fills its parent (w/h 100%).
 * Use as a div background (e.g. inside CTADiv), not on the shared ThreeJSCanvas.
 */
export default function GradientCloud({ className = '', params }: GradientCloudProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const defaults = { ...GRADIENTCLOUD_DEFAULTS, ...params };

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 6.5);
    camera.lookAt(0, 0, 0);

    const gradientCloud = createGradientCloud(scene, defaults);
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
      gradientCloud.resize(viewW, viewH, w, h);
    }
    FitToContainer();

    const ro = new ResizeObserver(() => FitToContainer());
    ro.observe(wrap);

    let animationFrameId = 0;
    function AnimationLoop() {
      const time = clock.getElapsedTime();
      gradientCloud.update(time, {
        speed: defaults.speed,
        opacity: defaults.opacity,
        colors: defaults.colors,
        grain_intensity: gradientCloudLive.grain_intensity,
        noise_size: gradientCloudLive.noise_size,
        rotation_speed: gradientCloudLive.rotation_speed,
      });
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(AnimationLoop);
    }
    AnimationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      gradientCloud.dispose();
      renderer.dispose();
    };
    // remount when serialized params change (optional overrides)
  }, [JSON.stringify(params)]);

  return (
    <div
      ref={wrapRef}
      className={`GradientCloud absolute inset-[0px] h-full w-full overflow-hidden ${className}`.trim()}
    >
      <canvas
        ref={canvasRef}
        className="gradient-cloud-canvas pointer-events-none absolute inset-[0px] h-full w-full"
      />
    </div>
  );
}
