import React from 'react';
import { InterfaceNotificationBlock } from '@/payload-types';
import { rte4ToHtml } from '@/utilities/rteToHtml';
import { Notification as BaseComponent } from '@/components/base/Notification/Notification';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceNotificationPropTypes = {} & InterfaceNotificationBlock;

const NotificationBase = async ({
  text,
}: InterfaceNotificationPropTypes): Promise<React.JSX.Element> => {
  const locale = await getLocale() as TypedLocale;

  return (
    <BaseComponent
      text={rte4ToHtml(text, locale)}
      type='success'
      colorMode='light'
      hideIcon={true}
      hideBorder={true}
    />
  );
};

export const Notification = React.memo(NotificationBase);
