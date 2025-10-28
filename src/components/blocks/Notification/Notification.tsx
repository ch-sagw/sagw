import React from 'react';
import { InterfaceNotificationBlock } from '@/payload-types';
import { rte3ToHtml } from '@/utilities/rteToHtml';
import { Notification as BaseComponent } from '@/components/base/Notification/Notification';

export type InterfaceNotificationPropTypes = {} & InterfaceNotificationBlock;

const NotificationBase = ({
  text,
}: InterfaceNotificationPropTypes): React.JSX.Element => (
  <BaseComponent
    text={rte3ToHtml(text)}
    type='success'
    colorMode='light'
    hideIcon={true}
    hideBorder={true}
  />
);

export const Notification = React.memo(NotificationBase);
