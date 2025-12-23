'use client';

import React from 'react';
import { Notification } from '@/components/base/Notification/Notification';

export type InterfaceStatusMessageClientPropTypes = {
  linkHref?: string;
  linkTextHtml?: string;
  messageHtml: string;
  titleHtml: string;
  type: 'success' | 'error' | 'warn';
};

export const StatusMessageClient = ({
  linkHref,
  linkTextHtml,
  messageHtml,
  titleHtml,
  type,
}: InterfaceStatusMessageClientPropTypes): React.JSX.Element => (
  <Notification
    colorMode='light'
    hideBorder={true}
    {...(linkHref && linkTextHtml
      ? {
        linkHref,
        linkText: linkTextHtml,
      }
      : {
        linkHref: undefined,
        linkText: undefined,
      })}
    text={messageHtml}
    title={titleHtml}
    type={type}
  />
);

