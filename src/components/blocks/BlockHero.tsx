'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import {
  ColorBlackDarkest,
  ColorCream,
  FontSize1,
  FontSize3,
  FontSize4,
  FontWeightBold,
  LineHeightSolid,
  Scale9,
  Scale10,
  Tracking2,
} from '@/utils/DesignSystem';

export default function BlockHero() {
  const { SM, MD } = useUtilBreakpoint();

  // mobile → tablet → desktop (all DesignSystem FontSize / Scale)
  const heroFontSize = MD ? FontSize1 : SM ? FontSize3 : FontSize4;
  const contentPadX = MD ? Scale9 : Scale10;

  return (
    <section
      className="BlockHero relative isolate h-[100dvh] min-h-[100vh] w-full overflow-hidden"
      style={{ backgroundColor: ColorBlackDarkest }}
    >
      <ThreeJSCanvas showControls={false} includeSunGlow includePSGrid />
      <div
        className="block-hero-content pointer-events-none absolute inset-[0px] z-[2] flex items-center justify-center"
        style={{ paddingLeft: contentPadX, paddingRight: contentPadX }}
      >
        <h1
          className="block-hero-title max-w-full text-center"
          style={{
            color: ColorCream,
            fontSize: heroFontSize,
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
