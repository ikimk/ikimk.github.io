'use client';
import React, { type ReactNode } from 'react';
import GradientCloud from '@/components/threejs/GradientCloud';

type CTADivProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * CTADiv — content block with GradientCloud as a full-bleed background
 * (GradientCloud uses its own canvas at w/h 100%).
 */
export default function CTADiv({ children, className = '' }: CTADivProps) {
  // default relative so GradientCloud can fill; pass absolute/fixed in className to position the CTA
  const positionClass = /\b(absolute|fixed|sticky)\b/.test(className)
    ? ''
    : 'relative';

  return (
    <div
      className={`CTADiv isolate overflow-hidden ${positionClass} ${className}`.trim()}
    >
      <div className="cta-div-bg absolute inset-[0px] z-[0] h-full w-full">
        <GradientCloud />
      </div>
      <div className="cta-div-content flex justify-center items-center h-full relative z-[1]">{children}</div>
    </div>
  );
}
