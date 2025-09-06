'use client';

import React from 'react';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { InterfaceNotification } from '@/payload-types';
import styles from '@/components/blocks/Notification/Notification.module.scss';
import { jsxConverters } from '@/richtext-converter';

export type InterfaceNotificationPropTypes = {} & InterfaceNotification;

export const Notification = ({
  text,
}: InterfaceNotificationPropTypes): React.JSX.Element => (
  <div className={styles.notification}>
    <RichText className={styles.rte} converters={jsxConverters} data={text} />
  </div>
);
