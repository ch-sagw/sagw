'use client';

import { ViewTransition } from 'react';

type Props = {
  children: React.ReactNode;
  name?: string;
};

export const PageMainViewTransition = ({
  children,
  name = 'page-main',
}: Props): React.JSX.Element => (
  <ViewTransition name={name}>
    {children}
  </ViewTransition>
);
