import { CollectionBeforeChangeHook } from 'payload';

import { Home } from '@/payload-types';

type Seo = NonNullable<Home['meta']>['seo'];

type WithSeo = {
  id: string | number;
  meta?: {
    seo?: Seo;
  };
  department: string;
};

export const hookSeoFallback: CollectionBeforeChangeHook<WithSeo> = async ({
  data, req,
}) => {

  if (!data) {
    return data;
  }

  const hasEntries =
    data.meta?.seo?.image &&
    data.meta?.seo?.title &&
    data.meta?.seo?.description;

  if (hasEntries) {
    return data;
  }

  const homePages = await req.payload.find({
    collection: 'home',
    limit: 1,
    where: {
      department: {
        equals: data.department,
      },
    },
  });

  if (!homePages.docs) {
    return data;
  }

  if (!homePages.docs.length) {
    return data;
  }

  const [homePage] = homePages.docs;

  const pageSeoTitle = data.meta?.seo?.title;
  const pageSeoImage = data.meta?.seo?.image;
  const pageSeoDescription = data.meta?.seo?.description;
  const homeSeoTitle = homePage.meta?.seo?.title;
  const homeSeoImage = homePage.meta?.seo?.image;
  const homeSeoDescription = homePage.meta?.seo?.description;

  const pageSeo = {
    description: (!pageSeoDescription || pageSeoDescription?.trim().length === 0)
      ? homeSeoDescription
      : pageSeoDescription,
    image: pageSeoImage || homeSeoImage,
    title: (!pageSeoTitle || pageSeoTitle?.trim().length === 0)
      ? homeSeoTitle
      : pageSeoTitle,
  };

  if (data.meta) {
    data.meta.seo = pageSeo;
  } else {
    data.meta = {
      seo: pageSeo,
    };
  }

  return data;
};
