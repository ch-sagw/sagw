import {
  expect,
  test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { generateTenant } from '@/test-helpers/tenant-generator';
import {
  generateHomePage,
  generatePublicationDetailPage,
} from '@/test-helpers/collections-generator';
import { extendExpect } from '@/access/test/extendExpect';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

extendExpect(expect);

test.describe('Publications Teaser', () => {
  beforeEachAcceptCookies();

  test('shows related teasers', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenant = await generateTenant({
      addDefaultTenantData: true,
      slug: `tenant-${time}`,
    });

    const home = await generateHomePage({
      locale: 'de',
      sideTitle: 'side',
      tenant: tenant.id,
      title: 'home',
    });

    const topic = await payload.create({
      collection: 'publicationTopics',
      data: {
        publicationTopic: simpleRteConfig(`Topic ${time}`),
        tenant,
      },
    });

    const topic2 = await payload.create({
      collection: 'publicationTopics',
      data: {
        publicationTopic: simpleRteConfig(`Topic 2 ${time}`),
        tenant,
      },
    });

    // publication pages with topic, unrelated topic and no topic

    await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `no topic ${time}`,
    });

    await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `topic ${time}`,
      topic: topic.id,
    });

    await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `topic 2 ${time}`,
      topic: topic2.id,
    });

    // publication page to place teaser

    const teaserPage = await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `teaser page ${time}`,
      topic: topic.id,
    });

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        content: [
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
        hero: {
          lead: simpleRteConfig('lead'),
          title: simpleRteConfig('hero'),
        },
      },
      id: teaserPage.id,
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/teaser-page-${time}`);
    await page.waitForLoadState('networkidle');

    // make sure all 4 publication pages are displayed
    const renderedNoTopic = await page.getByText(`no topic ${time}`, {
      exact: true,
    });
    const renderedTopic = await page.getByText(`topic ${time}`, {
      exact: true,
    });
    const renderedTopic2 = await page.getByText(`topic 2 ${time}`, {
      exact: true,
    });

    await expect(renderedNoTopic)
      .not.toBeVisible();
    await expect(renderedTopic)
      .toBeVisible();
    await expect(renderedTopic2)
      .not.toBeVisible();
  });
});
