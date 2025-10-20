import 'server-only';
import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';
import { RenderBlocks } from '@/app/(frontend)/RenderBlocks';
import { getTenant } from '@/app/providers/TenantProvider.server';
import { Header } from '@/components/global/Header/Header';
import { ColorMode } from '@/components/base/types/colorMode';

export const revalidate = 0;

// Define the DetailPage collections to search through
const DETAIL_PAGE_COLLECTIONS = [
  'detailPage',
  'overviewPage',
  'newsDetailPage',
  'publicationDetailPage',
  'projectDetailPage',
  'eventDetailPage',
  'instituteDetailPage',
  'magazineDetailPage',
  'nationalDictionaryDetailPage',
] as const;

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<React.JSX.Element> {

  const {
    slug, lang,
  } = await params;
  const payload = await getPayload({
    config: configPromise,
  });

  const tenant: string | null = await getTenant();

  if (!tenant) {
    return <p>No tenant data</p>;
  }

  const searchPromises = DETAIL_PAGE_COLLECTIONS.map(async (collection) => {
    try {
      const result = await payload.find({
        collection: collection as any,
        depth: 1,
        limit: 1,
        locale: lang as Config['locale'],
        overrideAccess: false,
        where: {
          and: [
            {
              slug: {
                equals: slug,
              },
            },
            {
              tenant: {
                equals: tenant,
              },
            },
          ],
        },
      });

      return {
        collection,
        result,
        success: true,
      };
    } catch (error) {
      // Collection might not exist or have different structure
      return {
        collection,
        error,
        success: false,
      };
    }
  });

  const searchResults = await Promise.allSettled(searchPromises);

  let pageData = null;

  // Find the first successful result with data
  for (const searchResult of searchResults) {
    if (searchResult.status === 'fulfilled' && searchResult.value.success) {
      const {
        result,
      } = searchResult.value;

      if (result && result.docs && result.docs.length > 0) {
        [pageData] = result.docs;
        break;
      }
    }
  }

  if (!pageData) {
    return <p>No page data</p>;
  }

  // Get header data (same as home page)
  const headerData = await payload.find({
    collection: 'header',
    depth: 1,
    limit: 1,
    locale: lang as Config['locale'],
    overrideAccess: false,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!headerData.docs || headerData.docs.length < 1) {
    return <p>No header data</p>;
  }

  const navData = headerData.docs[0].navigation;

  if (!navData || navData.navItems.length < 1) {
    return <p>No nav items in header data</p>;
  }

  const langnavData = headerData.docs[0].languageNavigation;

  if (!langnavData || !langnavData.description || !langnavData.title) {
    return <p>No lang nav data in header data</p>;
  }

  const metanavData = headerData.docs[0].metanavigation;

  if (!metanavData?.metaLinks || metanavData.metaLinks.length < 1) {
    return <p>No metanav data in header data</p>;
  }

  const colorMode: ColorMode = 'dark';

  const headerProps = {
    colorMode,
    currentLang: 'de',
    langnav: langnavData,
    logoLink: '/',
    menuButton: {
      close: 'Close',
      open: 'Open',
    },
    metanav: metanavData,
    navigation: navData,
  };

  return (
    <Fragment>
      <Header
        {...headerProps}
      />

      <main>
        <div className='detail-page'>
          <RenderBlocks
            blocks={pageData.content}
            tenantId={tenant}
          />
        </div>
      </main>
    </Fragment>
  );
}
