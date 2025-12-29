import 'server-only';
import React from 'react';
import {
  type Config, InterfaceNotificationBlock,
} from '@/payload-types';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { NotificationClient } from './Notification.client';

export type InterfaceNotificationPropTypes = {} & InterfaceNotificationBlock;

export const Notification = async ({
  text,
}: InterfaceNotificationPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as Config['locale'];
  const payload = await getPayloadCached();

  const textHtml = await rte3ToHtml({
    content: text,
    locale,
    payload,
  });

  return (
    <NotificationClient
      textHtml={textHtml}
    />
  );
};
