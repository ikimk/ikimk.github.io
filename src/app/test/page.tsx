'use client';
import React from 'react';
import GTA6ColorGlow_Border from '@/components/GTA6ColorGlow_Border';
import { ColorBlackDarkest } from '@/utils/DesignSystem';

export default function TestPage() {
  return (
    <div
      className="TestPage relative flex h-[100dvh] min-h-[100vh] w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: ColorBlackDarkest }}
    >
      <GTA6ColorGlow_Border
        variant="demo"
        className="test-page-gta6-color-glow-border"
      />
    </div>
  );
}
