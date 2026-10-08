'use client';
import React from 'react';
import Project, { type ProjectData } from '@/components/projects/Project';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import { Scale5, Scale6, Scale9, Scale10 } from '@/utils/DesignSystem';

import polka1 from '@/assets/projects/polkastarter/marketplace.polkastarter.com_1.png';
import polka2 from '@/assets/projects/polkastarter/marketplace.polkastarter.com_2.png';
import polka3 from '@/assets/projects/polkastarter/marketplace.polkastarter.com_3.png';
import polka4 from '@/assets/projects/polkastarter/marketplace.polkastarter.com_4.png';
import polka5 from '@/assets/projects/polkastarter/marketplace.polkastarter.com_5.png';
import polka6 from '@/assets/projects/polkastarter/marketplace.polkastarter.com_6.png';
import polka7 from '@/assets/projects/polkastarter/marketplace.polkastarter.com_7.png';

import nubikk1 from '@/assets/projects/nubikk/nft.nubikk.com_1.png';
import nubikk2 from '@/assets/projects/nubikk/nft.nubikk.com_2.png';
import nubikk3 from '@/assets/projects/nubikk/nft.nubikk.com_3.png';
import nubikk4 from '@/assets/projects/nubikk/nft.nubikk.com_4.png';
import nubikk5 from '@/assets/projects/nubikk/nft.nubikk.com_5.png';

import auto1 from '@/assets/projects/autostoken/www.autostoken.xyz_1.png';
import auto2 from '@/assets/projects/autostoken/www.autostoken.xyz_2.png';
import auto3 from '@/assets/projects/autostoken/www.autostoken.xyz_3.png';
import auto4 from '@/assets/projects/autostoken/www.autostoken.xyz_4.png';
import auto5 from '@/assets/projects/autostoken/www.autostoken.xyz_5.png';
import auto6 from '@/assets/projects/autostoken/www.autostoken.xyz_6.png';

const PROJECTS: ProjectData[] = [
  {
    title: 'Polkastarter',
    category: 'Marketplace Website',
    images: [
      { src: polka1.src, alt: 'Polkastarter marketplace — screen 1' },
      { src: polka2.src, alt: 'Polkastarter marketplace — screen 2' },
      { src: polka3.src, alt: 'Polkastarter marketplace — screen 3' },
      { src: polka4.src, alt: 'Polkastarter marketplace — screen 4' },
      { src: polka5.src, alt: 'Polkastarter marketplace — screen 5' },
      { src: polka6.src, alt: 'Polkastarter marketplace — screen 6' },
      { src: polka7.src, alt: 'Polkastarter marketplace — screen 7' },
    ],
  },
  {
    title: 'Nubikk',
    category: 'Marketplace Website',
    images: [
      { src: nubikk1.src, alt: 'Nubikk NFT — screen 1' },
      { src: nubikk2.src, alt: 'Nubikk NFT — screen 2' },
      { src: nubikk3.src, alt: 'Nubikk NFT — screen 3' },
      { src: nubikk4.src, alt: 'Nubikk NFT — screen 4' },
      { src: nubikk5.src, alt: 'Nubikk NFT — screen 5' },
    ],
  },
  {
    title: 'Autos Token',
    category: 'Website',
    images: [
      { src: auto1.src, alt: 'Autos Token — screen 1' },
      { src: auto2.src, alt: 'Autos Token — screen 2' },
      { src: auto3.src, alt: 'Autos Token — screen 3' },
      { src: auto4.src, alt: 'Autos Token — screen 4' },
      { src: auto5.src, alt: 'Autos Token — screen 5' },
      { src: auto6.src, alt: 'Autos Token — screen 6' },
    ],
  },
];

type ProjectsProps = {
  /** `overlay` = full-viewport shell (playground). `section` = page flow (homepage). */
  layout?: 'overlay' | 'section';
};

export default function Projects({ layout = 'section' }: ProjectsProps) {
  const { MD } = useUtilBreakpoint();

  const listPadX = MD ? Scale9 : Scale10;
  const listPadY = MD ? Scale5 : Scale6;
  const isOverlay = layout === 'overlay';

  return (
    <div
      id="work"
      className={
        isOverlay
          ? 'Projects pointer-events-auto absolute inset-[0px] z-[2] h-full w-full overflow-y-auto overscroll-none'
          : 'Projects relative z-[1] w-full'
      }
    >
      <div
        className="projects-list box-border flex w-full max-w-full flex-col"
        style={{
          paddingLeft: listPadX,
          paddingRight: listPadX,
          // Homepage: tight top so projects sit under Hello World like Figma
          paddingTop: isOverlay ? listPadY : Scale10,
          paddingBottom: listPadY,
          gap: Scale6,
        }}
      >
        {PROJECTS.map((project) => (
          <section
            key={project.title}
            className="projects-item box-border w-full max-w-full"
          >
            <Project project={project} />
          </section>
        ))}
      </div>
    </div>
  );
}
