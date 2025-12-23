'use client';

import React from 'react';
import { Notification as BaseComponent } from '@/components/base/Notification/Notification';

export type InterfaceNotificationClientPropTypes = {
  textHtml: string;
};

export const NotificationClient = ({
  textHtml,
}: InterfaceNotificationClientPropTypes): React.JSX.Element => (
  <BaseComponent
    colorMode='light'
    hideBorder={true}
    hideIcon={true}
    text={textHtml}
    type='success'
  />
);

