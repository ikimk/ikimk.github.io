'use client';
import React from 'react';
import ActionBtn from '@/components/ActionBtn';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import { ThreeColorPSGridGlyphError } from '@/components/threejs/threeJSColors';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import {
  ColorBlackDarkest,
  ColorStone,
  ColorOrange,
  FontSize4,
  FontSize5,
  FontSize6,
  FontSize8,
  FontWeightBold,
  LineHeightSolid,
  PageMaxWidth,
  Scale9,
  Scale10,
  Tracking2,
} from '@/utils/DesignSystem';

export default function NotFoundPage() {
  // XL = min-width 1400 (golden base / Scale1)
  const { SM, MD, XL } = useUtilBreakpoint();

  const titleFontSize = XL
    ? FontSize4
    : MD
    ? FontSize5
    : SM
    ? FontSize6
    : FontSize8;
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
        <div className="not-found-page-content pointer-events-none absolute inset-[0px] z-[2] flex items-center justify-center">
          <div
            className="not-found-page-content-inner box-border flex w-full justify-center"
            style={{
              maxWidth: PageMaxWidth,
              paddingLeft: contentPadX,
              paddingRight: contentPadX,
            }}
          >
            <div className="not-found-page-text-wrap flex flex-col items-start">
              <h1
                className="not-found-page-title pointer-events-auto max-w-full select-text"
                style={{
                  color: ColorStone,
                  fontSize: titleFontSize,
                  fontWeight: FontWeightBold,
                  lineHeight: LineHeightSolid,
                  letterSpacing: Tracking2,
                }}
              >
                Error 404.
              </h1>
              <div
                className="not-found-page-btn-row pointer-events-auto"
                style={{
                  paddingLeft: Scale9,
                }}
              >
                <ActionBtn
                  text="Go back"
                  actionDotColor={ColorOrange}
                  href="/"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
