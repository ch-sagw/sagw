'use client';

import React from 'react';
import Link from 'next/link';
import { useTrackEvent } from '@/components/helpers/useTrackEvent';

/* eslint-disable @typescript-eslint/naming-convention -- html attributes */
type InterfaceTrackedLinkBaseProps = {
  href: string;

  /**
   * Fathom event names fired on click (see tracking.constants.ts). Only
   * serializable strings, so server components can pass them down.
   */
  trackingEvents?: readonly string[];
  children?: React.ReactNode;
  className?: string;
  target?: '_self' | '_blank';
  'aria-label'?: string;
  'data-testid'?: string;
};
/* eslint-enable @typescript-eslint/naming-convention */

type InterfaceNextLinkProps = InterfaceTrackedLinkBaseProps & {

  /** `next/link` (default). */
  element?: 'link';
  prefetch?: boolean | null;
};

type InterfaceAnchorProps = InterfaceTrackedLinkBaseProps & {

  /** Plain `<a>`, for non-page targets like file downloads. */
  element: 'a';
  prefetch?: never;
};

export type InterfaceTrackedLinkPropTypes = InterfaceNextLinkProps | InterfaceAnchorProps;

/**
 * Thin wrapper around `next/link` / `<a>` which fires Fathom events on
 * click. Renders exactly like the underlying element when no events are
 * given, so it can be used unconditionally.
 */
export const TrackedLink = ({
  href,
  trackingEvents,
  children,
  className,
  target,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  ...rest
}: InterfaceTrackedLinkPropTypes): React.JSX.Element => {
  const trackEvents = useTrackEvent();

  const handleClick = (): void => {
    trackEvents(trackingEvents);
  };

  if (rest.element === 'a') {
    return (
      <a
        aria-label={ariaLabel}
        className={className}
        data-testid={dataTestId}
        href={href}
        onClick={handleClick}
        target={target}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      data-testid={dataTestId}
      href={href}
      onClick={handleClick}
      prefetch={rest.prefetch}
      target={target}
    >
      {children}
    </Link>
  );
};
