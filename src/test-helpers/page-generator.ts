import { getPayload } from 'payload';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  DetailPage, OverviewPage,
} from '@/payload-types';

import configPromise from '@/payload.config';
import { getTenant } from '@/app/providers/TenantProvider.server';

interface InterfacePageProps {
  title: string;
  navigationTitle?: string;
  parentPage?: {
    slug: string,
    documentId: string;
  }
}

const generatePage = async ({
  title,
  navigationTitle,
  parentPage,
  type,
}: {
  type: 'overviewPage' | 'detailPage';
} & InterfacePageProps): Promise<OverviewPage | DetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const document = await payload.create({
    collection: type,
    data: {
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(title),
      },
      navigationTitle,
      parentPage,
      tenant,
    },
  });

  return document;
};

export const generateOverviewPage = async (props: InterfacePageProps): Promise<OverviewPage> => (await generatePage({
  ...props,
  type: 'overviewPage',
})) as OverviewPage;

export const generateDetailPage = async (props: InterfacePageProps): Promise<DetailPage> => (await generatePage({
  ...props,
  type: 'detailPage',
})) as DetailPage;
