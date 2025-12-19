// TODO: we must invalidate static paths in following cases
// 1. if display property is changed to: show, hide or date (will
// be handled in general manner: if page changes -> invalidate static paths)
// 2. if current date is later then configured toDate

import 'server-only';
import React, { Fragment } from 'react';
import {
  type Config, InterfaceStatusMessage,
} from '@/payload-types';
import { Notification } from '@/components/base/Notification/Notification';
import { rteToHtml } from '@/utilities/rteToHtml';
import { getLocale } from 'next-intl/server';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceStatusMessagePropTypes = {} & InterfaceStatusMessage;

export const StatusMessage = async ({
  type,
  title,
  message,
  optionalLink,
  show,
}: InterfaceStatusMessagePropTypes): Promise<React.JSX.Element> => {
  let shouldShow = true;

  if (show.display === 'hide') {
    shouldShow = false;
  }

  if (show.display === 'date' && show.from && show.to) {
    const today = new Date();
    const fromDate = new Date(show.from);
    const toDate = new Date(show.to);

    // Normalize all dates to ignore time
    const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayDay = startOfDay(today);
    const fromDay = startOfDay(fromDate);
    const toDay = startOfDay(toDate);

    if (fromDay && toDay) {
      shouldShow = todayDay >= fromDay && todayDay <= toDay;
    } else {
      shouldShow = false;
    }
  }

  if (!shouldShow) {
    return <Fragment />;
  }

  let linkHref = '';
  const locale = (await getLocale()) as Config['locale'];
  const payload = await getPayloadCached();

  if (optionalLink?.link?.internalLink.documentId) {
    linkHref = await getPageUrl({
      locale,
      pageId: optionalLink?.link?.internalLink.documentId,
      payload,
    });
  }

  return (
    <Notification
      colorMode='light'
      hideBorder={true}
      type={type}
      title={rteToHtml(title)}
      text={rteToHtml(message)}

      // TODO: generate url
      linkHref={linkHref}
      linkText={rteToHtml(optionalLink?.link?.linkText)}
    />
  );
};
