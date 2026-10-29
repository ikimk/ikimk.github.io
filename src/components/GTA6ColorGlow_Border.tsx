'use client';

import React from 'react';
import { ColorCream, FontSize10 } from '@/utils/DesignSystem';
import './GTA6ColorGlow_Border.scss';

type GTA6ColorGlow_BorderProps = {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  /** Fixed demo card on /test. Default = fluid frame for host layouts. */
  variant?: 'frame' | 'demo';
  /** Demo defaults to 0; frame hosts can omit to avoid extra tab stops. */
  tabIndex?: number;
};

/**
 * GTA6ColorGlow_Border — justice.church GTA product-card glow.
 * ::before soft bloom + ::after 1px traveling rim.
 */
export default function GTA6ColorGlow_Border({
  className = '',
  children,
  style,
  variant = 'frame',
  tabIndex,
}: GTA6ColorGlow_BorderProps) {
  const variantClass = variant === 'demo' ? 'GTA6ColorGlow_Border--demo' : '';
  const resolvedTabIndex = tabIndex ?? (variant === 'demo' ? 0 : undefined);

  return (
    <div
      className={`GTA6ColorGlow_Border ${variantClass} ${className}`.trim()}
      style={style}
      tabIndex={resolvedTabIndex}
    >
      <div className="gta6-color-glow-border-inner">
        {children ?? (
          <span
            className="gta6-color-glow-border-label"
            style={{
              color: ColorCream,
              fontSize: FontSize10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Hover me
          </span>
        )}
      </div>
    </div>
  );
}
