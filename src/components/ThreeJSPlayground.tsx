'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import Projects from '@/components/projects/Projects';
import { ColorBlackDarkest } from '@/utils/DesignSystem';

export default function ThreeJSPlayground() {
  return (
    <div
      className="ThreeJSPlayground relative h-[100dvh] min-h-[100vh] w-full overflow-hidden"
      style={{ backgroundColor: ColorBlackDarkest }}
    >
      <ThreeJSCanvas />
      <Projects layout="overlay" />
    </div>
  );
}
