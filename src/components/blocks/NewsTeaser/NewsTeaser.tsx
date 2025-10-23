import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { rteToHtml } from '@/utilities/rteToHtml';
import {
  Config,
  InterfaceNewsTeasersBlock,
} from '@/payload-types';
import { NewsTeaserComponent } from '@/components/blocks/NewsTeaser/NewsTeaser.component';
import { convertPayloadNewsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';

type InterfaceNewsTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceNewsTeasersBlock;

export const NewsTeaser = async (props: InterfaceNewsTeaserPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  // Get news data
  const newsPages = await payload.find({
    collection: 'newsDetailPage',
    depth: 1,

    // TODO: how many?
    limit: 4,
    locale: props.language,
    overrideAccess: false,
    pagination: false,
    sort: '-hero.date',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);
  let allLink;

  if (props.link === 'yes' && props.linkText) {
    allLink = {

      // TODO
      href: '/overview',

      text: rteToHtml(props.linkText),
    };
  }

  const items = convertPayloadNewsPagesToFeItems(newsPages, props.language);

  return (

    <NewsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
    />
  );

};
