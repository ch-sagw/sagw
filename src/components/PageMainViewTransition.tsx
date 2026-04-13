'use client';

import { ViewTransition } from 'react';

type Props = {
  children: React.ReactNode;
  name?: string;
  // When true, in-place React updates inside this boundary
  // (e.g. server actions, form success state) do not run
  // view-transition animations. Route navigations still
  // use the outer named transition.
  suppressInPlaceUpdates?: boolean;
};

export const PageMainViewTransition = ({
  children,
  name = 'page-main',
}: Props): React.JSX.Element => (
  <ViewTransition name={name}>
    {children}
  </ViewTransition>
);
