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
  suppressInPlaceUpdates = false,
}: Props): React.JSX.Element => {
  const props: {
    name: string;
    update?: string;
  } = {
    name,
  };

  if (suppressInPlaceUpdates) {
    props.update = 'none';
  }

  return (
    <ViewTransition {...props}>
      {children}
    </ViewTransition>
  );
};
