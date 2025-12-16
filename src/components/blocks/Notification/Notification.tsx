import React from 'react';
import { getLocale } from 'next-intl/server';
import type { TypedLocale } from 'payload';
import { InterfaceNotificationBlock } from '@/payload-types';
import { rte3ToHtml } from '@/utilities/rteToHtml';
import { Notification as BaseComponent } from '@/components/base/Notification/Notification';

export type InterfaceNotificationPropTypes = {} & InterfaceNotificationBlock;

export const Notification = async ({
  text,
}: InterfaceNotificationPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;

  return (
    <BaseComponent
      text={rte3ToHtml(text, locale)}
      type='success'
      colorMode='light'
      hideIcon={true}
      hideBorder={true}
    />
  );
};
