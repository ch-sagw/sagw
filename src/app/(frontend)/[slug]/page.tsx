import 'server-only';
import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';
import { RenderBlocks } from '@/app/(frontend)/RenderBlocks';
import { getTenant } from '@/app/providers/TenantProvider.server';

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

  const language = lang as Config['locale'] || 'de';

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
        locale: language,
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

  // i18n

  const i18nDataDocs = await payload.find({
    collection: 'i18nGlobals',
    depth: 1,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!i18nDataDocs.docs || i18nDataDocs.docs.length < 1) {
    return <p>No i18n data</p>;
  }

  const [i18nData] = i18nDataDocs.docs;

  return (
    <Fragment>
      <main>
        <div className='detail-page'>
          <RenderBlocks
            blocks={pageData.content || pageData.blocks.content}
            tenantId={tenant}
            pageLanguage={language}
            i18n={i18nData}
          />
        </div>
      </main>
    </Fragment>
  );
}
