'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import {
  ColorBlackDarkest,
  ColorCream,
  FontSize5,
  FontSize6,
  FontSize8,
  FontWeightBold,
  LineHeightSolid,
  Scale9,
  Scale10,
  Tracking2,
} from '@/utils/DesignSystem';

type BlockHeroProps = {
  /** When false, parent owns the shared Three.js canvas (homepage). */
  includeCanvas?: boolean;
};

export default function BlockHero({ includeCanvas = true }: BlockHeroProps) {
  const { SM, MD } = useUtilBreakpoint();

  // mobile → tablet → desktop (all DesignSystem FontSize / Scale)
  const heroFontSize = MD ? FontSize5 : SM ? FontSize6 : FontSize8;
  const contentPadX = MD ? Scale9 : Scale10;

  // Homepage: shorter hero so Projects peek into the first viewport (Figma).
  // Standalone (with own canvas): full viewport.
  const isPageFlow = !includeCanvas;

  return (
    <section
      className={`BlockHero relative isolate flex w-full items-center justify-center ${
        isPageFlow
          ? 'min-h-[0px]'
          : 'h-[100dvh] min-h-[100vh] overflow-hidden'
      }`}
      style={{
        backgroundColor: includeCanvas ? ColorBlackDarkest : 'transparent',
        // Figma: Hello World sits in the upper band; projects start in-frame
        height: isPageFlow ? '62vh' : undefined,
        minHeight: isPageFlow ? 420 : undefined,
        paddingLeft: contentPadX,
        paddingRight: contentPadX,
      }}
    >
      {includeCanvas ? (
        <ThreeJSCanvas showControls={false} includeSunGlow includePSGrid />
      ) : null}
      <div className="block-hero-content relative z-[2] flex w-full items-center justify-center">
        <h1
          className="block-hero-title max-w-full select-text text-center"
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
