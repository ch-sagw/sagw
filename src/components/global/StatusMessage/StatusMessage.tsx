import React from 'react';
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
}: InterfaceStatusMessagePropTypes): React.JSX.Element => (
  <Notification
    colorMode='light'
    hideBorder={true}
    type={type}
    title={rteToHtml(title)}
    text={rteToHtml(message)}
    linkHref={optionalLink?.link?.internalLink || ''}
    linkText={rteToHtml(optionalLink?.link?.linkText)}
    pageLanguage={pageLanguage}
  />
);
