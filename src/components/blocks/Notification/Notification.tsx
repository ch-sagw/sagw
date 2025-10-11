import React from 'react';
import { InterfaceNotificationBlock } from '@/payload-types';
import styles from '@/components/blocks/Notification/Notification.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rte3ToHtml } from '@/utilities/rteToHtml';

export type InterfaceNotificationPropTypes = {} & InterfaceNotificationBlock;

const NotificationBase = ({
  text,
}: InterfaceNotificationPropTypes): React.JSX.Element => (
  <div
    className={styles.notification}
    data-testid='notification'
  >
    <SafeHtml
      as='div'
      html={rte3ToHtml(text)}
    />
  </div>
);

export const Notification = React.memo(NotificationBase);
