'use client';
import React from 'react';
import BlockHero from '@/components/blocks/BlockHero';
import { ColorBlack } from '@/utils/color';

export default function HomePage() {
  return (
    <div
      className="HomePage relative isolate min-h-[100vh]"
      style={{ backgroundColor: ColorBlack }}
    >
      <BlockHero />
    </div>
  );
}
