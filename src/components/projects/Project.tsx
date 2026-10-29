'use client';
import React from 'react';
import GTA6ColorGlow_Border from '@/components/GTA6ColorGlow_Border';
import {
  ColorCream,
  ColorGray,
  FontSize10,
  FontWeightSemiBold,
  FontWeightRegular,
  LineHeightAuto,
  LineHeightSolid,
  PageMaxWidth,
  Radius10,
  Scale10,
  Scale11,
  Scale3,
  Scale8,
  Tracking1,
  Tracking2,
} from '@/utils/DesignSystem';

export type ProjectData = {
  title: string;
  category: string;
  images: { src: string; alt: string }[];
};

type ProjectProps = {
  project: ProjectData;
  /** Horizontal inset — matches page pad; rails use it for Apple-style full-bleed scroll */
  padX: number;
};

/** Room for GTA bloom blur inside overflow-x rail (overflow-y can’t stay visible). */
const RAIL_GLOW_PAD = 24;

export default function Project({ project, padX }: ProjectProps) {
  // Align first/last cards with PageMaxWidth column; rail itself is full viewport
  const railPadInline = `max(${padX}px, calc((100vw - ${PageMaxWidth}px) / 2 + ${padX}px))`;
  // Integer px — fractional Scale3 (534.54) jitters borders/filters while scrolling
  const railItemHeight = Math.round(Scale3);

  return (
    <article
      className="Project flex w-full max-w-full flex-col"
      style={{ gap: Scale10 }}
    >
      <div
        className="project-header mx-auto box-border flex w-full items-end justify-between"
        style={{
          maxWidth: PageMaxWidth,
          paddingLeft: padX,
          paddingRight: padX,
          gap: Scale11,
        }}
      >
        <h2
          className="project-title min-w-[0px] shrink"
          style={{
            color: ColorCream,
            fontSize: Scale8,
            fontWeight: FontWeightSemiBold,
            lineHeight: LineHeightSolid,
            letterSpacing: Tracking1,
            overflowWrap: 'anywhere',
          }}
        >
          {project.title}
        </h2>
        <p
          className="project-category shrink-0 text-right"
          style={{
            color: ColorGray,
            fontSize: FontSize10,
            fontWeight: FontWeightRegular,
            lineHeight: LineHeightAuto,
            letterSpacing: Tracking2,
          }}
        >
          {project.category}
        </p>
      </div>

      <div
        className="project-rail flex w-screen max-w-[100vw] overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          gap: Scale10,
          paddingLeft: railPadInline,
          paddingRight: railPadInline,
          // Bloom paints into padding (overflow clips at padding edge, not content box)
          paddingTop: RAIL_GLOW_PAD,
          paddingBottom: RAIL_GLOW_PAD,
          // Break out of any centered parent to true viewport width
          marginLeft: 'calc(50% - 50vw)',
        }}
      >
        {project.images.map((image, i) => (
          <GTA6ColorGlow_Border
            key={`${project.title}-${i}`}
            className="project-rail-item relative box-border shrink-0"
            style={
              {
                height: railItemHeight,
                width: 'auto',
                ['--gta6-color-glow-border-radius' as string]: `${Radius10}px`,
                ['--gta6-color-glow-bloom-room' as string]: `${RAIL_GLOW_PAD}px`,
              } as React.CSSProperties
            }
          >
            <div className="project-rail-item-media h-full overflow-hidden rounded-[inherit]">
              <img
                className="project-rail-item-img block h-full w-auto max-w-none object-cover"
                src={image.src}
                alt={image.alt}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </GTA6ColorGlow_Border>
        ))}
      </div>
    </article>
  );
}
