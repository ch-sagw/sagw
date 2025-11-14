import React, { Fragment } from 'react';
import {
  Config, InterfaceStatusMessage,
} from '@/payload-types';
// import { Icon } from '@/icons';
import { Notification } from '@/components/base/Notification/Notification';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceStatusMessagePropTypes = {
  pageLanguage: Config['locale'],
} & InterfaceStatusMessage;

export const StatusMessage = ({
  type,
  title,
  message,
  optionalLink,
  pageLanguage,
  show,
}: InterfaceStatusMessagePropTypes): React.JSX.Element => {
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

    // Inclusive check: true if today is the same as from/to or between them
    if (fromDay && toDay) {
      shouldShow = todayDay >= fromDay && todayDay <= toDay;
    }
  }

  if (!shouldShow) {
    return <Fragment />;
  }

  return (
    <Notification
      colorMode='light'
      hideBorder={true}
      type={type}
      title={rteToHtml(title)}
      text={rteToHtml(message)}

      // TODO: generate url
      linkHref={optionalLink?.link?.internalLink.slug || ''}
      linkText={rteToHtml(optionalLink?.link?.linkText)}
      pageLanguage={pageLanguage}
    />
  );
};
