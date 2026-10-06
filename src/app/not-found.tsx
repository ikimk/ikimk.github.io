'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import { ThreeColorPSGridGlyphError } from '@/components/threejs/threeJSColors';
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

export default function NotFoundPage() {
  const { SM, MD } = useUtilBreakpoint();

  const titleFontSize = MD ? FontSize1 : SM ? FontSize3 : FontSize4;
  const contentPadX = MD ? Scale9 : Scale10;

  return (
    <div
      className="NotFoundPage relative isolate min-h-[100vh]"
      style={{ backgroundColor: ColorBlackDarkest }}
    >
      <section
        className="not-found-page-hero relative isolate h-[100dvh] min-h-[100vh] w-full overflow-hidden"
        style={{ backgroundColor: ColorBlackDarkest }}
      >
        <ThreeJSCanvas
          showControls={false}
          includeSunGlow
          includePSGrid
          psGridGlyphColor={ThreeColorPSGridGlyphError}
          psGridOpacity={0.5}
          psGridOpacityTo={1}
        />
        <div
          className="not-found-page-content pointer-events-none absolute inset-[0px] z-[2] flex items-center justify-center"
          style={{ paddingLeft: contentPadX, paddingRight: contentPadX }}
        >
          <h1
            className="not-found-page-title max-w-full text-center"
            style={{
              color: ColorCream,
              fontSize: titleFontSize,
              fontWeight: FontWeightBold,
              lineHeight: LineHeightSolid,
              letterSpacing: Tracking2,
            }}
          >
            Error 404
          </h1>
        </div>
      </section>
    </div>
  );
}
