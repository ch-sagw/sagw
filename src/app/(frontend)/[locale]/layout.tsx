import 'server-only';
import React from 'react';
import '../styles.scss';
import { TypedLocale } from 'payload';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { NoJsScript } from '@/components/helpers/noJsScript';

type InterfaceRootLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

// TODO: get proper metadata
export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
};

export default async function RootLayout({
  children,
  params,
}: InterfaceRootLayoutProps): Promise<React.JSX.Element> {
  const {
    locale: localeString,
  } = await params;
  const locale = localeString as TypedLocale;

  // define locale for next-intl provider
  setRequestLocale(locale);

  return (
    <html
      className='theme-sagw no-js'
      lang={locale}
    >
      <NoJsScript />
      <head>
        <link
          rel='preload'
          href='/webfonts/HelveticaNowText-Medium-lf.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/webfonts/HelveticaNowDisplay-Bold-lf.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
