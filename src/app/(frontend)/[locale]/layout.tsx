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
  icons: {
    apple: [
      {
        sizes: '180x180',
        url: '/favicons/sagw/apple-touch-icon-dark.png',
      },
    ],
    icon: [
      {
        sizes: '32x32',
        url: '/favicons/sagw/favicon.ico',
      },
      {
        type: 'image/svg+xml',
        url: '/favicons/sagw/favicon.svg',
      },
    ],
  },
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
      <body>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
