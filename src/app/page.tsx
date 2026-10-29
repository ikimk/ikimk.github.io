'use client';
import React from 'react';
import BlockHero from '@/components/blocks/BlockHero';
import Projects from '@/components/projects/Projects';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import { ColorBlackDarkest, PageMaxWidth } from '@/utils/DesignSystem';

export default function HomePage() {
  return (
    <div
      className="HomePage relative isolate min-h-[100vh]"
      style={{ backgroundColor: ColorBlackDarkest }}
    >
      {/* Canvas stays full viewport */}
      <div className="home-page-canvas pointer-events-none fixed inset-[0px] z-[0] h-[100dvh] min-h-[100vh] w-full overflow-hidden">
        <ThreeJSCanvas showControls={false} includeSunGlow includePSGrid />
      </div>
      <div
        className="home-page-content relative z-[1] mx-auto w-full"
        style={{ maxWidth: PageMaxWidth }}
      >
        <BlockHero includeCanvas={false} />
      </div>
      {/* Full viewport width — project rails scroll edge-to-edge (Apple-style) */}
      <div className="home-page-projects relative z-[1] w-full">
        <Projects layout="section" />
      </div>
    </div>
  );
}
