'use client';
import React from 'react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import CTADiv from '@/components/CTADiv';

export default function ThreeJSPlayground() {
  return (
    <div className="ThreeJSPlayground px-[20px] flex flex-col gap-[20px] justify-center items-center relative w-full h-[100vh] overflow-hidden">
      <ThreeJSCanvas />
      <p className="three-js-playground-text pointer-events-none inset-[0px] flex items-center justify-center text-[130px] font-[600] tracking-[-0.08em] text-[#ffffff]">
        HELLO
      </p>
      <CTADiv className="three-js-playground-cta h-[300px] w-[70%] overflow-hidden rounded-[12px] border-[1px] border-[#532416]">
        <div className="cta-div-inner flex h-full flex-col items-center justify-center gap-[8px] px-[24px]">
          <p className="cta-div-title m-[0px] text-[18px] font-[600] leading-[24px] text-[#ffffff]">
            GradientCloud CTA
          </p>
        </div>
      </CTADiv>
    </div>
  );
}
