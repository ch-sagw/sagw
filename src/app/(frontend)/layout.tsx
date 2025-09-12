import 'server-only';
import React from 'react';
import './styles.scss';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
};

export default function RootLayout(props: { children: React.ReactNode }): React.JSX.Element {
  const {
    children,
  } = props;

  return (
    <html className='theme-sagw' lang='en'>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
