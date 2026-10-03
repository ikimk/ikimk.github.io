'use client';
import React, { useState, useEffect } from 'react';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import { usePathname } from 'next/navigation';
import Icons from '@/config/icon';
import Image from 'next/image';
import Link from 'next/link';

import BlockHero from '@/components/blocks/BlockHero';

export default function HomePage() {
  return (
    <div className="HomePage relative isolate">
      <BlockHero />
    </div>
  );
}
