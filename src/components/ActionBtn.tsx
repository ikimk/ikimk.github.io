'use client';
import React from 'react';
import Link from 'next/link';
import {
  ColorOrange,
  ColorWhite,
  FontSize10,
  FontWeightSemiBold,
  LineHeightAuto,
  Scale10,
  Scale12,
  Scale14,
  Scale16,
  Scale9,
  Tracking2,
} from '@/utils/DesignSystem';

export type ActionBtnProps = {
  text: string;
  /** `action_dot` fill — default ColorOrange (`#FF5320`) */
  actionDotColor?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * ActionBtn — Figma text + action_dot + partial underline.
 * Size / padding / height stay fixed; only `text` + `actionDotColor` change.
 */
export default function ActionBtn({
  text,
  actionDotColor = ColorOrange,
  href,
  onClick,
  className = '',
}: ActionBtnProps) {
  const body = (
    <>
      <span
        className="action-btn-label relative z-[1]"
        style={{
          color: ColorWhite,
          fontSize: FontSize10,
          fontWeight: FontWeightSemiBold,
          lineHeight: LineHeightAuto,
          letterSpacing: Tracking2,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      <span
        className="action-btn-item relative z-[1] box-border flex h-full shrink-0 items-end"
        aria-hidden
        style={{
          paddingBottom: Scale10,
        }}
      >
        <span
          className="action-btn-dot block shrink-0 rounded-full"
          style={{
            width: Scale12,
            height: Scale12,
            backgroundColor: actionDotColor,
          }}
        />
      </span>
      <span
        className="action-btn-border pointer-events-none absolute w-[0px] group-hover:w-[var(--action-btn-border-w)]"
        style={{
          left: Scale14,
          bottom: 0,
          height: Scale16,
          backgroundColor: ColorWhite,
          transition: 'all 0.13s 0s ease-out',
        }}
        aria-hidden
      />
    </>
  );

  const sharedClassName =
    `ActionBtn group relative inline-flex items-center ${className}`.trim();
  const sharedStyle: React.CSSProperties = {
    height: Scale9,
    gap: Scale14,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    ['--action-btn-border-w' as string]: `${Scale9}px`,
  };

  if (href) {
    return (
      <Link
        href={href}
        className={sharedClassName}
        style={sharedStyle}
        onClick={onClick}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={sharedClassName}
      style={sharedStyle}
      onClick={onClick}
    >
      {body}
    </button>
  );
}
