'use client';

import { ViewTransition } from 'react';

type Props = {
  children: React.ReactNode;
  name?: string;
};

const viewTransitionsDisabled =
  process.env.NEXT_PUBLIC_DISABLE_VIEW_TRANSITIONS === 'true';

export const PageMainViewTransition = ({
  children,
  name = 'page-main',
}: Props): React.JSX.Element => {
  if (viewTransitionsDisabled) {
    return <>{children}</>;
  }

  return (
    <ViewTransition name={name}>
      {children}
    </ViewTransition>
  );
};
