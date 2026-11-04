import '@/assets/scss/globals.scss';
import '@/assets/scss/layout.scss';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AppProvider } from '@/app/app';
import Loading from '@/app/loading';
import { ConfigProvider, theme } from 'antd';
import ClientWrapper from '@/app/ClientWrapper';
import { colorCssVars } from '@/utils/DesignSystem';

export const metadata: Metadata = {
  metadataBase: new URL('https://AppName.com'),
  title: 'AppName - AppName',
  description: 'AppName description',
  openGraph: {
    type: 'website',
    url: 'https://AppName.com/',
    title: 'AppName - AppName',
    description: 'AppName description',
    // images: [
    //   {
    //     url: '/images/metaCover.jpg',
    //     width: 1200,
    //     height: 628,
    //     alt: 'AppName',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://AppName.com/',
    title: 'AppName - AppName',
    description: 'AppName description',
    // images: [
    //   {
    //     url: '/images/metaCover.jpg',
    //     width: 1200,
    //     height: 628,
    //     alt: 'AppName',
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={colorCssVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Open Sans — must be <link>, not SCSS @import (bundler puts @import mid-CSS → ignored) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="App ">
          <ConfigProvider
            theme={{
              // 1. Use dark algorithm
              algorithm: theme.darkAlgorithm,
            }}
          >
            <ClientWrapper>
              <Header />
              <Suspense fallback={<Loading />}>
                <main className="Main relative z-[1]">
                  <AppProvider>{children}</AppProvider>
                </main>
              </Suspense>
              {/* <Footer /> */}
            </ClientWrapper>
          </ConfigProvider>
        </div>
      </body>
    </html>
  );
}
