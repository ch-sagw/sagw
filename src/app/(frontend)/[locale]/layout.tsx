import 'server-only';
import React from 'react';
import '../styles.scss';
import { TypedLocale } from 'payload';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages, setRequestLocale,
} from 'next-intl/server';
import { NoJsScript } from '@/components/helpers/noJsScript';

type InterfaceRootLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

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

  // Load messages for the client provider
  const messages = await getMessages();

  return (
    <html
      className='theme-sagw no-js'
      lang={locale}
    >
      <NoJsScript />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
