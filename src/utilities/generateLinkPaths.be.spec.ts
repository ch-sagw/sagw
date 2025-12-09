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
// import { generateTenant } from '@/test-helpers/tenant-generator';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';
import { simpleRteConfig } from './simpleRteConfig';
import { generateTenant } from '@/test-helpers/tenant-generator';

// sagw-tenant:
// - Generate overview and detail page. home is parent of overview,
// overview is parent of detail.
// - Generate a separate detail page and link to the previous detail
// page in an rte field.
// - Add a link block with an internal link to the previous detail page.
// Expect: both links to have correct url: {locale}/{tenantSlug}/{pageSlug}
test('Generates correct links for sagw tenant', async () => {
  let result: any;
  let level1: any;
  let level2: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      title: `Detail Page ${time}`,
    });

    result = await generateDetailPage({
      content: [
        {
          blockType: 'textBlock',
          text: sampleRteWithLink({
            documentId: level2.id,
            slug: 'detailPage',
          }),
        },
        {
          blockType: 'linksBlock',
          links: [
            {
              linkInternal: {
                internalLink: {
                  documentId: level2.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('foo'),
              },
              linkType: 'internal',
            },
          ],
        },
      ],
      title: `Other Detail Page ${time}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  // check rte links

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields;

  expect(rteLinkPathFields.pathde)
    .toBe(`/de/overview-page-${time}/detail-page-${time}`);

  expect(rteLinkPathFields.pathfr)
    .toBe(`/fr/overview-page-${time}/detail-page-${time}`);

  expect(rteLinkPathFields.pathit)
    .toBe(`/it/overview-page-${time}/detail-page-${time}`);

  expect(rteLinkPathFields.pathen)
    .toBe(`/en/overview-page-${time}/detail-page-${time}`);

  // check linksBlock link
  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink;

  expect(linkBlockLinks.pathde)
    .toBe(`/de/overview-page-${time}/detail-page-${time}`);

  expect(linkBlockLinks.pathfr)
    .toBe(`/fr/overview-page-${time}/detail-page-${time}`);

  expect(linkBlockLinks.pathit)
    .toBe(`/it/overview-page-${time}/detail-page-${time}`);

  expect(linkBlockLinks.pathen)
    .toBe(`/en/overview-page-${time}/detail-page-${time}`);

});

// non sagw-tenant:
test('Generates correct links for non-sagw tenant', async () => {
  let result: any;
  let level1: any;
  let level2: any;

  const time = (new Date())
    .getTime();

  try {

    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Overview Page ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Detail Page ${time}`,
    });

    result = await generateDetailPage({
      content: [
        {
          blockType: 'textBlock',
          text: sampleRteWithLink({
            documentId: level2.id,
            slug: 'detailPage',
          }),
        },
        {
          blockType: 'linksBlock',
          links: [
            {
              linkInternal: {
                internalLink: {
                  documentId: level2.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('foo'),
              },
              linkType: 'internal',
            },
          ],
        },
      ],
      tenant: tenant.id,
      title: `Other Detail Page ${time}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  // check rte links

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields;

  expect(rteLinkPathFields.pathde)
    .toBe(`/de/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  expect(rteLinkPathFields.pathfr)
    .toBe(`/fr/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  expect(rteLinkPathFields.pathit)
    .toBe(`/it/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  expect(rteLinkPathFields.pathen)
    .toBe(`/en/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  // check linksBlock link
  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink;

  expect(linkBlockLinks.pathde)
    .toBe(`/de/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  expect(linkBlockLinks.pathfr)
    .toBe(`/fr/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  expect(linkBlockLinks.pathit)
    .toBe(`/it/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  expect(linkBlockLinks.pathen)
    .toBe(`/en/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

});

// sagw-tenant:
// - Generate a detail page without parent
// - Generate a separate detail page and link to the previous detail
// page in an rte field.
// - Add a link block with an internal link to the previous detail page.
// Expect: both links to have correct url: {locale}/{pageSlug}
test('Generates correct links (target page has no parent) for sagw tenant', async () => {
  let result: any;
  let level1: any;

  const time = (new Date())
    .getTime();

  try {
    level1 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    result = await generateDetailPage({
      content: [
        {
          blockType: 'textBlock',
          text: sampleRteWithLink({
            documentId: level1.id,
            slug: 'detailPage',
          }),
        },
        {
          blockType: 'linksBlock',
          links: [
            {
              linkInternal: {
                internalLink: {
                  documentId: level1.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('foo'),
              },
              linkType: 'internal',
            },
          ],
        },
      ],
      title: `Other Detail Page ${time}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  // check rte links

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields;

  expect(rteLinkPathFields.pathde)
    .toBe(`/de/detail-page-${time}`);

  expect(rteLinkPathFields.pathfr)
    .toBe(`/fr/detail-page-${time}`);

  expect(rteLinkPathFields.pathit)
    .toBe(`/it/detail-page-${time}`);

  expect(rteLinkPathFields.pathen)
    .toBe(`/en/detail-page-${time}`);

  // check linksBlock link
  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink;

  expect(linkBlockLinks.pathde)
    .toBe(`/de/detail-page-${time}`);

  expect(linkBlockLinks.pathfr)
    .toBe(`/fr/detail-page-${time}`);

  expect(linkBlockLinks.pathit)
    .toBe(`/it/detail-page-${time}`);

  expect(linkBlockLinks.pathen)
    .toBe(`/en/detail-page-${time}`);

});

// non sagw-tenant:
test('Generates correct links (target page has no parent) for non-sagw tenant', async () => {
  let result: any;
  let level1: any;

  const time = (new Date())
    .getTime();

  try {

    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
    });

    level1 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      tenant: tenant.id,
      title: `Detail Page ${time}`,
    });

    result = await generateDetailPage({
      content: [
        {
          blockType: 'textBlock',
          text: sampleRteWithLink({
            documentId: level1.id,
            slug: 'detailPage',
          }),
        },
        {
          blockType: 'linksBlock',
          links: [
            {
              linkInternal: {
                internalLink: {
                  documentId: level1.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('foo'),
              },
              linkType: 'internal',
            },
          ],
        },
      ],
      tenant: tenant.id,
      title: `Other Detail Page ${time}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  // check rte links

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields;

  expect(rteLinkPathFields.pathde)
    .toBe(`/de/${time}-tenant-1/detail-page-${time}`);

  expect(rteLinkPathFields.pathfr)
    .toBe(`/fr/${time}-tenant-1/detail-page-${time}`);

  expect(rteLinkPathFields.pathit)
    .toBe(`/it/${time}-tenant-1/detail-page-${time}`);

  expect(rteLinkPathFields.pathen)
    .toBe(`/en/${time}-tenant-1/detail-page-${time}`);

  // check linksBlock link
  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink;

  expect(linkBlockLinks.pathde)
    .toBe(`/de/${time}-tenant-1/detail-page-${time}`);

  expect(linkBlockLinks.pathfr)
    .toBe(`/fr/${time}-tenant-1/detail-page-${time}`);

  expect(linkBlockLinks.pathit)
    .toBe(`/it/${time}-tenant-1/detail-page-${time}`);

  expect(linkBlockLinks.pathen)
    .toBe(`/en/${time}-tenant-1/detail-page-${time}`);

});
