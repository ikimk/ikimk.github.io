'use client';
import React, { useEffect } from 'react';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*<BlockLoader/>*/}
      {children}
    </>
  );
}
