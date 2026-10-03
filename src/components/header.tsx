'use client';
import { usePathname } from 'next/navigation';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import React, { useState, useEffect } from 'react';
import Icons from '@/config/icon';
import Image from 'next/image';
import Link from 'next/link';
import '@/assets/scss/header.scss';

export const Header = () => {
  const { XS, SM, MD, LG, XL, XXL } = useUtilBreakpoint();
  const [MenuOpen, setMenuOpen] = useState(false);
  const Pathname = usePathname();
  // (item.link == Pathname ? 'Active_Pathname' : '')

  return (
    <header className={`BlockHeader block-container`}>
      <nav className="block-row">
        <div className="info-container">
          <div className="info-wrap">
            <h3>BlockHeader</h3>

            <Link className="link-item" href={'/'}>
              <p>Link Item</p>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
