import 'server-only';
import React from 'react';
import './styles.scss';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  Config, InterfaceStatusMessage,
} from '@/payload-types';
import { StatusMessage } from '@/components/global/StatusMessage/StatusMessage';

interface InterfaceRenderStatusMessage {
  language: Config['locale'];
  tenant: string;
  isHome: boolean;
}

export const RenderStatusMessage = async ({
  language,
  tenant,
  isHome,
}: InterfaceRenderStatusMessage): Promise<React.JSX.Element | undefined> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const statusMessageDocs = await payload.find({
    collection: 'statusMessage',
    depth: 1,
    limit: 1,
    locale: language,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const statusMessageContent: InterfaceStatusMessage | undefined =
    statusMessageDocs.docs && statusMessageDocs.docs.length === 1
      ? statusMessageDocs.docs[0].content
      : undefined;

  if (!statusMessageContent) {
    return undefined;
  }

  if (statusMessageContent.showOnHomeOnly && !isHome) {
    return undefined;
  }

  return (
    <StatusMessage
      {...statusMessageContent}
      pageLanguage={language}
    />
  );
};
