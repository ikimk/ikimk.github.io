'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import { ColorBlack, ColorCream } from '@/utils/color';
import {
  FontSize1,
  FontWeightBold,
  LineHeightSolid,
  Tracking2,
} from '@/utils/typo';

export default function BlockHero() {
  return (
    <section
      className="BlockHero relative isolate h-[100vh] w-full overflow-hidden"
      style={{ backgroundColor: ColorBlack }}
    >
      <ThreeJSCanvas showControls={false} includeSunGlow />
      <div className="block-hero-content pointer-events-none absolute inset-[0px] z-[2] flex items-center justify-center">
        <h1
          className="block-hero-title text-center"
          style={{
            color: ColorCream,
            fontSize: FontSize1,
            fontWeight: FontWeightBold,
            lineHeight: LineHeightSolid,
            letterSpacing: Tracking2,
          }}
        >
          Hello World.
        </h1>
      </div>
    </section>
  );
}
