import {
  expect,
  test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenantId } from '@/test-helpers/tenant-generator';
import {
  generateDetailPage, getHomeId,
} from '@/test-helpers/collections-generator';
import { extendExpect } from '@/access/test/extendExpect';

extendExpect(expect);

test.describe('Page copy', () => {

  test('does not error', async () => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const original = await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    await expect(async () => {
      await payload.duplicate({
        collection: 'detailPage',
        id: original.id,
        locale: 'de',
      });
    })
      .notRejects();

  });

  test('duplicates page with a rewritten unique slug', async () => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const original = await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    const duplicated = await payload.duplicate({
      collection: 'detailPage',
      id: original.id,
      locale: 'de',
    });

    expect(duplicated.slug)
      .toMatch(new RegExp(`^${original.slug}-copy-\\d+$`, 'u'));
  });
});
