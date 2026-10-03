'use client';
import useUtilBreakpoint from '@/utils/useUtilBreakpoint';
import React, { useState, useEffect } from 'react';
import Icons from '@/config/icon';
import Image from 'next/image';
import Link from 'next/link';
import '@/assets/scss/footer.scss';

export const Footer = () => {
  const ThisYear = new Date().getFullYear();
  const { XS, SM, MD, LG, XL, XXL } = useUtilBreakpoint();

  return (
    <footer className={`BlockFooter block-container`}>
      <nav className="block-row">
        <div className="info-container">
          <div className="info-wrap">
            <h3>Footer</h3>

            <p className="copy">© {ThisYear} All rights reserved</p>
          </div>
        </div>
      </nav>
    </footer>
  );
};
