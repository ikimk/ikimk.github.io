'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/assets/scss/header.scss';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import {
  ColorCream,
  ColorGlitchBlue,
  ColorGlitchRed,
  ColorWhite,
  FontSize2,
  FontWeightBold,
  FontWeightRegular,
  FontWeightSemiBold,
  Scale9,
  Scale10,
  Scale11,
  Tracking1,
} from '@/utils/DesignSystem';

function LogoMark({
  className,
  hidden,
}: {
  className: string;
  hidden?: boolean;
}) {
  return (
    <span className={className} aria-hidden={hidden || undefined}>
      <span
        className="block-header-logo-i"
        style={{ fontWeight: FontWeightBold }}
      >
        i
      </span>
      <span
        className="block-header-logo-code"
        style={{ fontWeight: FontWeightSemiBold }}
      >
        Code
      </span>
      <span
        className="block-header-logo-ayush"
        style={{ fontWeight: FontWeightBold }}
      >
        AYUSH
      </span>
    </span>
  );
}

export const Header = () => {
  const pathname = usePathname();
  const { SM } = useUtilBreakpoint();
  const padX = SM ? Scale9 : Scale10;
  const padY = Scale10;
  const linkGap = Scale11;

  // playground — canvas + controls only
  if (pathname === '/test') return null;

  return (
    <header className="BlockHeader pointer-events-none absolute top-[0px] left-[0px] z-[2] w-full">
      <nav
        className="block-header-nav pointer-events-auto flex w-full items-center justify-between"
        style={{
          paddingLeft: padX,
          paddingRight: padX,
          paddingTop: padY,
          paddingBottom: padY,
        }}
      >
        <Link
          href="/"
          className="block-header-logo relative inline-flex shrink-0"
          style={{
            color: ColorWhite,
            fontSize: FontSize2,
            lineHeight: `${FontSize2}px`,
            letterSpacing: Tracking1,
            ['--color-glitch-blue' as string]: ColorGlitchBlue,
            ['--color-glitch-red' as string]: ColorGlitchRed,
          }}
          aria-label="iCodeAYUSH home"
        >
          <LogoMark
            className="block-header-logo-ghost block-header-logo-ghost-cyan"
            hidden
          />
          <LogoMark
            className="block-header-logo-ghost block-header-logo-ghost-red"
            hidden
          />
          <LogoMark className="block-header-logo-face" />
        </Link>

        <div
          className="block-header-links flex shrink-0 items-center"
          style={{ gap: linkGap }}
        >
          <Link
            href="#work"
            className="block-header-link"
            style={{
              color: ColorCream,
              fontSize: FontSize2,
              lineHeight: `${FontSize2}px`,
              fontWeight: FontWeightRegular,
              letterSpacing: Tracking1,
            }}
          >
            Work
          </Link>
          <Link
            href="#contact"
            className="block-header-link"
            style={{
              color: ColorCream,
              fontSize: FontSize2,
              lineHeight: `${FontSize2}px`,
              fontWeight: FontWeightRegular,
              letterSpacing: Tracking1,
            }}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};
