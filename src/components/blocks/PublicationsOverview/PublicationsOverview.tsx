import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { PublicationsOverviewComponent } from '@/components/blocks/PublicationsOverview/PublicationsOverview.component';
import {
  Config, InterfacePublicationsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { convertPayloadPublicationsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';

type InterfaceNewsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfacePublicationsOverviewBlock;

export const PublicationsOverview = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {

  const payload = await getPayload({
    config: configPromise,
  });

  // Get news pages data
  const publicationPages = await payload.find({
    collection: 'publicationDetailPage',
    depth: 1,
    limit: 4,
    locale: props.language,
    overrideAccess: false,
    pagination: false,
    sort: '-overviewPageProps.date',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);

  const items = convertPayloadPublicationsPagesToFeItems(publicationPages, props.language);

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <PublicationsOverviewComponent
      colorMode='white'
      items={items}
      notification={{
        text: 'Das ist ein Test',
        title: '',
      }}
      paginationTitle='Pagination'
      title={title}
    />
  );
};
