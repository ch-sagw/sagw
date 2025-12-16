import {
  expect,
  test,
} from '@playwright/test';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  generateDetailPage,
  generateHomePage,
  generateOverviewPage,
} from '@/test-helpers/page-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { getTenant } from '@/app/providers/TenantProvider.server';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';

test('Deletes source links if target Link document is deleted (sagw tenant)', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const tenant = await getTenant();

    const home = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      title: `Other Detail Page ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
        ],
      },
      id: level2.id,
    });

    await payload.delete({
      collection: 'overviewPage',
      id: level1.id,
    });

    result = await payload.findByID({
      collection: 'detailPage',
      id: level2.id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  const linkElement = result.content[0].links[0].linkInternal.internalLink.url;
  const rteLink = result.content[1].text.root.children[0].children[0].fields.internalUrl;

  await expect(linkElement.de)
    .toStrictEqual('/de');
  await expect(rteLink.de)
    .toStrictEqual('/de');

});

test('Regenerates source links if target url changes (non-sagw tenant)', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      tenant: tenant.id,
      title: `Other Detail Page ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
        ],
      },
      id: level2.id,
    });

    await payload.delete({
      collection: 'overviewPage',
      id: level1.id,
    });

    result = await payload.findByID({
      collection: 'detailPage',
      id: level2.id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  const linkElement = result.content[0].links[0].linkInternal.internalLink.url;
  const rteLink = result.content[1].text.root.children[0].children[0].fields.internalUrl;

  await expect(linkElement.de)
    .toStrictEqual(`/de/${time}-tenant-1`);

  await expect(rteLink.de)
    .toStrictEqual(`/de/${time}-tenant-1`);

});
