import 'server-only';
import React from 'react';
import './styles.scss';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { getTenant } from '@/app/providers/TenantProvider.server';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactElement;
}): Promise<React.JSX.Element> {
  const tenant = await getTenant();

  if (!tenant) {
    return <p>No tenant data</p>;
  }

  return (
    <html className='theme-sagw' lang='en'>
      <body>
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
