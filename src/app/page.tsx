'use client';
import React from 'react';
import BlockHero from '@/components/blocks/BlockHero';
import { ColorBlackDarkest } from '@/utils/DesignSystem';

export default function HomePage() {
  return (
    <div
      className="HomePage relative isolate min-h-[100vh]"
      style={{ backgroundColor: ColorBlackDarkest }}
    >
      <BlockHero />
    </div>
  );
}
