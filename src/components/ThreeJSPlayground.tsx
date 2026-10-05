'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';

export default function ThreeJSPlayground() {
  return (
    <div className="ThreeJSPlayground px-[20px] flex flex-col gap-[20px] justify-center items-center relative w-full h-[100vh] overflow-hidden">
      <ThreeJSCanvas />
      <p className="three-js-playground-text pointer-events-none inset-[0px] flex items-center justify-center text-[130px] font-[600] tracking-[-0.08em] text-[#ffffff]">
        Hello World.
      </p>
    </div>
  );
}
