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
import { colorCssVars } from '@/utils/color';

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
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
        {/* Inter */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        /> */}
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
