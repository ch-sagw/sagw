import 'server-only';
import React from 'react';
import './styles.scss';
import { TypedLocale } from 'payload';
import { InterfaceStatusMessage } from '@/payload-types';
import { StatusMessage } from '@/components/global/StatusMessage/StatusMessage';
import { getPayloadCached } from '@/utilities/getPayloadCached';

interface InterfaceRenderStatusMessage {
  tenant: string;
  isHome: boolean;
  locale: TypedLocale;
}

export const RenderStatusMessage = async ({
  tenant,
  isHome,
  locale,
}: InterfaceRenderStatusMessage): Promise<React.JSX.Element | undefined> => {
  const payload = await getPayloadCached();

  const statusMessageDocs = await payload.find({
    collection: 'statusMessage',
    depth: 1,
    limit: 1,
    locale,
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
    />
  );
};
