'use client';
import React from 'react';
import Link from 'next/link';
import '@/assets/scss/header.scss';
import { ColorCream, ColorWhite } from '@/utils/color';
import { Scale9, Scale10, Scale11 } from '@/utils/goldenRatio';
import {
  FontSize2,
  FontWeightBold,
  FontWeightRegular,
  FontWeightSemiBold,
  Tracking1,
} from '@/utils/typo';

export const Header = () => {
  return (
    <header className="BlockHeader pointer-events-none absolute top-[0px] left-[0px] z-[2] w-full">
      <nav
        className="block-header-nav pointer-events-auto flex w-full items-center justify-between"
        style={{
          paddingLeft: Scale9,
          paddingRight: Scale9,
          paddingTop: Scale10,
          paddingBottom: Scale10,
        }}
      >
        <Link
          href="/"
          className="block-header-logo"
          style={{
            color: ColorWhite,
            fontSize: FontSize2,
            lineHeight: `${FontSize2}px`,
            letterSpacing: Tracking1,
          }}
          aria-label="iCodeAYUSH home"
        >
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
        </Link>

        <div
          className="block-header-links flex items-center"
          style={{ gap: Scale11 }}
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
