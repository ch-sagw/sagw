import {
  expect,
  test,
} from '@playwright/test';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { generateDetailPage } from '@/test-helpers/page-generator';
import { getTenant } from '@/test-helpers/tenant-generator';

const getCollectionsDocumentForId = async (id: string): Promise<any> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const linksCollectionDocument = await payload.find({
    collection: 'links',
    limit: 1,
    where: {
      and: [
        {
          documentId: {
            equals: id,
          },
        },
      ],
    },
  });

  return linksCollectionDocument.docs[0];
};

test('Deletes document if source of document is unpublished', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const tenant = await getTenant();

    if (tenant) {

      const detailPage = await generateDetailPage({
        navigationTitle: 'd1',
        tenant,
        title: `d1 ${time}`,
      });

      const payload = await getPayload({
        config: configPromise,
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          ...detailPage,

          // eslint-disable-next-line @typescript-eslint/naming-convention
          _status: 'draft',
        },
        id: detailPage.id,
      });

      result = await getCollectionsDocumentForId(detailPage.id);
    }

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result)
    .toBeUndefined();

});

test('Does not create link document on page draft', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const detailPage = await generateDetailPage({
      draft: true,
      navigationTitle: 'd1',
      title: `d1 ${time}`,
    });

    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result)
    .toBeUndefined();

});

