import 'server-only';
import React, { Fragment } from 'react';
import {
  type Config, InterfaceStatusMessage,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { getLocale } from 'next-intl/server';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { StatusMessageClient } from './StatusMessage.client';

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

  if (!shouldShow) {
    return <Fragment />;
  }

  const locale = (await getLocale()) as Config['locale'];
  const payload = await getPayloadCached();

  const titleHtml = rteToHtml(title);
  const messageHtml = rteToHtml(message);

  let linkHref: string | undefined;
  let linkTextHtml: string | undefined;

  if (optionalLink?.link?.internalLink.documentId) {
    linkHref = await getPageUrl({
      locale,
      pageId: optionalLink.link.internalLink.documentId,
      payload,
    });

    if (optionalLink.link.linkText) {
      linkTextHtml = rteToHtml(optionalLink.link.linkText);
    }
  }

  return (
    <StatusMessageClient
      linkHref={linkHref}
      linkTextHtml={linkTextHtml}
      messageHtml={messageHtml}
      titleHtml={titleHtml}
      type={type}
    />
  );
};
