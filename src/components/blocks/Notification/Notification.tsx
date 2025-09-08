import 'server-only';
import React from 'react';
import { InterfaceNotification } from '@/payload-types';
import styles from '@/components/blocks/Notification/Notification.module.scss';
import { Rte } from '@/components/base/Rte/Rte';

export type InterfaceNotificationPropTypes = {} & InterfaceNotification;

export const Notification = ({
  text,
}: InterfaceNotificationPropTypes): React.JSX.Element => (
  <div
    className={styles.notification}
    data-testid='notification'
  >
    <Rte
      text={text.content}
      context='notification'
      rteConfig='rte2'
    />
  </div>
);
