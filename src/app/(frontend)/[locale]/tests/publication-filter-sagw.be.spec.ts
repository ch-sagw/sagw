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
  generateOverviewPage, generatePublicationDetailPage, getHomeId,
} from '@/test-helpers/collections-generator';
import { extendExpect } from '@/access/test/extendExpect';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

extendExpect(expect);

test.describe('Publications Filter', () => {
  beforeEachAcceptCookies();

  test('correctly filters', async ({
    page,
  }) => {
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

    const topic = await payload.create({
      collection: 'publicationTopics',
      data: {
        publicationTopic: simpleRteConfig(`Topic ${time}`),
        tenant,
      },
    });

    const type = await payload.create({
      collection: 'publicationTypes',
      data: {
        publicationType: simpleRteConfig(`Type ${time}`),
        tenant,
      },
    });

    // publication pages with topics/types in all combinations

    await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `no topic no type ${time}`,
    });

    await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `topic type ${time}`,
      topic: topic.id,
      type: type.id,
    });

    await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `topic no type ${time}`,
      topic: topic.id,
    });

    await generatePublicationDetailPage({
      date: '2031-08-01T12:00:00.000Z',
      locale: 'de',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `no topic type ${time}`,
      type: type.id,
    });

    // overviewpage with publications overview

    const overview = await generateOverviewPage({
      locale: 'de',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'publicationsOverviewBlock',
            filterTitleAllPublications: simpleRteConfig('Types'),
            filterTitleAllTopics: simpleRteConfig('Topics'),
            title: simpleRteConfig('Publications'),

          },
        ],
        hero: {
          lead: simpleRteConfig('lead'),
          title: simpleRteConfig('hero'),
        },
      },
      id: overview.id,
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    // make sure all 4 publication pages are displayed
    const noTopicNoType = await page.getByText(`no topic no type ${time}`, {
      exact: true,
    });
    const topicNoType = await page.getByText(`topic no type ${time}`, {
      exact: true,
    });
    const noTopicType = await page.getByText(`no topic type ${time}`, {
      exact: true,
    });
    const topicType = await page.getByText(`topic type ${time}`, {
      exact: true,
    });

    await expect(noTopicNoType)
      .toBeVisible();
    await expect(topicNoType)
      .toBeVisible();
    await expect(noTopicType)
      .toBeVisible();
    await expect(topicType)
      .toBeVisible();

    const filters = await page.getByTestId('filter');
    const filterTopic = filters.nth(0)
      .getByTestId('filter-select');
    const filterType = filters.nth(1)
      .getByTestId('filter-select');

    // filter topic
    await filterTopic.selectOption({
      index: 1,
    });

    await filterType.selectOption({
      index: 0,
    });

    await expect(noTopicNoType)
      .not.toBeVisible();
    await expect(topicNoType)
      .toBeVisible();
    await expect(noTopicType)
      .not.toBeVisible();
    await expect(topicType)
      .toBeVisible();

    // filter type
    await filterTopic.selectOption({
      index: 0,
    });

    await filterType.selectOption({
      index: 1,
    });

    await expect(noTopicNoType)
      .not.toBeVisible();
    await expect(topicNoType)
      .not.toBeVisible();
    await expect(noTopicType)
      .toBeVisible();
    await expect(topicType)
      .toBeVisible();

    // filter topic and type
    await filterTopic.selectOption({
      index: 1,
    });

    await filterType.selectOption({
      index: 1,
    });

    await expect(noTopicNoType)
      .not.toBeVisible();
    await expect(topicNoType)
      .not.toBeVisible();
    await expect(noTopicType)
      .not.toBeVisible();
    await expect(topicType)
      .toBeVisible();
  });
});
