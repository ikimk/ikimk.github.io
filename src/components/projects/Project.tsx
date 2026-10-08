'use client';
import React from 'react';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import {
  ColorCream,
  FontSize10,
  FontWeightBold,
  FontWeightRegular,
  LineHeightAuto,
  LineHeightSolid,
  Scale10,
  Scale11,
  Scale12,
  Scale3,
  Scale4,
  Scale6,
  Scale7,
  Scale8,
  Scale9,
  Tracking2,
  TrackingAuto,
} from '@/utils/DesignSystem';

export type ProjectData = {
  title: string;
  category: string;
  images: { src: string; alt: string }[];
};

type ProjectProps = {
  project: ProjectData;
};

export default function Project({ project }: ProjectProps) {
  const { MD, LG } = useUtilBreakpoint();

  const titleSize = LG ? Scale6 : MD ? Scale7 : Scale8;
  const cardHeight = MD ? Scale3 : Scale4;
  const cardRadius = Scale9;
  const headerGap = Scale10;
  const railGap = Scale11;

  return (
    <article
      className="Project flex w-full max-w-full flex-col"
      style={{ gap: headerGap }}
    >
      <div
        className="project-header flex w-full items-end justify-between"
        style={{ gap: Scale11 }}
      >
        <h2
          className="project-title min-w-[0px] shrink"
          style={{
            color: ColorCream,
            fontSize: titleSize,
            fontWeight: FontWeightBold,
            lineHeight: LineHeightSolid,
            letterSpacing: Tracking2,
            overflowWrap: 'anywhere',
          }}
        >
          {project.title}
        </h2>
        <p
          className="project-category shrink-0 text-right"
          style={{
            color: ColorCream,
            fontSize: FontSize10,
            fontWeight: FontWeightRegular,
            lineHeight: LineHeightAuto,
            letterSpacing: TrackingAuto,
            paddingBottom: Scale12,
          }}
        >
          {project.category}
        </p>
      </div>

      <div
        className="project-rail flex w-full max-w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: railGap }}
      >
        {project.images.map((image, i) => (
          <div
            key={`${project.title}-${i}`}
            className="project-rail-item relative shrink-0 overflow-hidden"
            style={{
              height: cardHeight,
              borderRadius: cardRadius,
            }}
          >
            <img
              className="project-rail-item-img block h-full w-auto max-w-none"
              src={image.src}
              alt={image.alt}
              draggable={false}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
