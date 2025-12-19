import 'server-only';
import React from 'react';
import {
  type Config, InterfaceNotificationBlock,
} from '@/payload-types';
import { rte3ToHtml } from '@/utilities/rteToHtml';
import { Notification as BaseComponent } from '@/components/base/Notification/Notification';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceNotificationPropTypes = {} & InterfaceNotificationBlock;

export const Notification = async ({
  text,
}: InterfaceNotificationPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as Config['locale'];
  const payload = await getPayloadCached();

  const html = await rte3ToHtml({
    content: text,
    locale,
    payload,
  });

  return (
    <BaseComponent
      text={html}
      type='success'
      colorMode='light'
      hideIcon={true}
      hideBorder={true}
    />
  );
};
