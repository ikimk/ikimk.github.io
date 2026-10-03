'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';

export default function ThreeJSPlayground() {
  return (
    <div className="ThreeJSPlayground relative w-full h-[100vh] overflow-hidden">
      <ThreeJSCanvas />
      <p className="three-js-playground-text pointer-events-none absolute inset-[0px] z-[2] m-[0px] flex items-center justify-center text-[130px] font-[600] tracking-[-0.08em] text-[#ffffff]">
        HELLO
      </p>
    </div>
  );
}
