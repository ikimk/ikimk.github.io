'use client';
import React from 'react';
import { UserProvider } from '@/context/GlobalContext';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default ClientWrapper;
