'use client';
import React, { useState, useEffect } from 'react';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import Icons from '@/config/icon';
import Image from 'next/image';
import Link from 'next/link';

export default function BlockHero() {
  const { XS, SM, MD, LG, XL, XXL } = useUtilBreakpoint();
  // console.log('info', info);

  return (
    <div className={`BlockHero block-container`}>
      <div className="block-row">
        <div className="info-container">
          <div className="info-wrap">
            <h3>Hello</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
