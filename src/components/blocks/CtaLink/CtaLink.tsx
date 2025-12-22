import 'server-only';
import React from 'react';
import { InterfaceCtaLinkBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { TypedLocale } from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { CtaLinkClient } from './CtaLink.client';

export type InterfaceCtaLinkPropTypes = {} & InterfaceCtaLinkBlock;

export const CtaLink = async (props: InterfaceCtaLinkPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();

  const titleHtml = rteToHtml(props.title);
  const subtitleHtml = rteToHtml(props.text);

  let linkText = '';
  let linkHref = '';

  if (props.linkType === 'external' && props.linkExternal) {
    linkText = rteToHtml(props.linkExternal.externalLinkText);
    linkHref = props.linkExternal.externalLink;
  } else if (props.linkType === 'internal' && props.linkInternal) {
    linkText = rteToHtml(props.linkInternal.linkText);

    linkHref = await getPageUrl({
      locale,
      pageId: props.linkInternal.internalLink.documentId,
      payload,
    });
  } else if (props.linkType === 'mail' && props.linkMail) {
    linkText = rteToHtml(props.linkMail.linkText);
    linkHref = props.linkMail.email;
  }

  return (
    <CtaLinkClient
      linkHref={linkHref}
      linkText={linkText}
      linkType={props.linkType || 'internal'}
      subtitleHtml={subtitleHtml}
      titleHtml={titleHtml}
    />
  );
};
