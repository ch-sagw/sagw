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
import { sampleRteWithLink } from '@/utilities/rteSampleContent';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { getTenant } from '@/app/providers/TenantProvider.server';

test('Generates correct links for sagw tenant', {
  tag: '@linking',
}, async () => {
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

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields.internalUrl;

  await expect(rteLinkPathFields.de)
    .toBe(`/de/overview-page-${time}/detail-page-${time}`);

  await expect(rteLinkPathFields.fr)
    .toBe('/fr');

  await expect(rteLinkPathFields.it)
    .toBe('/it');

  await expect(rteLinkPathFields.en)
    .toBe('/en');

  // check linksBlock link

  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink.url;

  await expect(linkBlockLinks.de)
    .toBe(`/de/overview-page-${time}/detail-page-${time}`);

  await expect(linkBlockLinks.fr)
    .toBe('/fr');

  await expect(linkBlockLinks.it)
    .toBe('/it');

  await expect(linkBlockLinks.en)
    .toBe('/en');
});

test('Generates correct links for non-sagw tenant', {
  tag: '@linking',
}, async () => {
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

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields.internalUrl;

  await expect(rteLinkPathFields.de)
    .toBe(`/de/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  await expect(rteLinkPathFields.fr)
    .toBe('/fr');

  await expect(rteLinkPathFields.it)
    .toBe('/it');

  await expect(rteLinkPathFields.en)
    .toBe('/en');

  // check linksBlock link
  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink.url;

  await expect(linkBlockLinks.de)
    .toBe(`/de/${time}-tenant-1/overview-page-${time}/detail-page-${time}`);

  await expect(linkBlockLinks.fr)
    .toBe('/fr');

  await expect(linkBlockLinks.it)
    .toBe('/it');

  await expect(linkBlockLinks.en)
    .toBe('/en');

});

test('Generates correct links (target page has no parent) for sagw tenant', {
  tag: '@linking',
}, async () => {
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

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields.internalUrl;

  await expect(rteLinkPathFields.de)
    .toBe(`/de/detail-page-${time}`);

  await expect(rteLinkPathFields.fr)
    .toBe('/fr');

  await expect(rteLinkPathFields.it)
    .toBe('/it');

  await expect(rteLinkPathFields.en)
    .toBe('/en');

  // check linksBlock link
  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink.url;

  await expect(linkBlockLinks.de)
    .toBe(`/de/detail-page-${time}`);

  await expect(linkBlockLinks.fr)
    .toBe('/fr');

  await expect(linkBlockLinks.it)
    .toBe('/it');

  await expect(linkBlockLinks.en)
    .toBe('/en');

});

test('Generates correct links (target page has no parent) for non-sagw tenant', {
  tag: '@linking',
}, async () => {
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

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields.internalUrl;

  await expect(rteLinkPathFields.de)
    .toBe(`/de/${time}-tenant-1/detail-page-${time}`);

  await expect(rteLinkPathFields.fr)
    .toBe('/fr');

  await expect(rteLinkPathFields.it)
    .toBe('/it');

  await expect(rteLinkPathFields.en)
    .toBe('/en');

  // check linksBlock link
  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink.url;

  await expect(linkBlockLinks.de)
    .toBe(`/de/${time}-tenant-1/detail-page-${time}`);

  await expect(linkBlockLinks.fr)
    .toBe('/fr');

  await expect(linkBlockLinks.it)
    .toBe('/it');

  await expect(linkBlockLinks.en)
    .toBe('/en');

});

test('Generates correct links for consent fields', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const consentData = await payload.find({
      collection: 'consent',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    const detailPage2 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page 2 ${time}`,
    });

    const detailPage3 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page 3 ${time}`,
    });

    result = await payload.update({
      collection: 'consent',
      data: {
        banner: {
          text: sampleRteWithLink({
            documentId: detailPage.id,
            slug: 'detailPage',
          }),
        },
        overlay: {
          analyticsPerformance: {
            text: sampleRteWithLink({
              documentId: detailPage3.id,
              slug: 'detailPage',
            }),
          },
          externalContent: {
            text: sampleRteWithLink({
              documentId: detailPage3.id,
              slug: 'detailPage',
            }),
          },
          necessaryCookies: {
            text: sampleRteWithLink({
              documentId: detailPage3.id,
              slug: 'detailPage',
            }),
          },
          text: sampleRteWithLink({
            documentId: detailPage2.id,
            slug: 'detailPage',
          }),
        },
      },
      id: consentData.docs[0].id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  const bannerLink = result.banner.text.root.children[0].children[0].fields;
  const overlayTextLink = result.overlay.text.root.children[0].children[0].fields;
  const analyticsLink = result.overlay.analyticsPerformance.text.root.children[0].children[0].fields;
  const externalLink = result.overlay.externalContent.text.root.children[0].children[0].fields;
  const neccessaryLink = result.overlay.necessaryCookies.text.root.children[0].children[0].fields;

  await expect(bannerLink.internalUrl.de)
    .toBe(`/de/detail-page-${time}`);
  await expect(overlayTextLink.internalUrl.de)
    .toBe(`/de/detail-page-2-${time}`);
  await expect(analyticsLink.internalUrl.de)
    .toBe(`/de/detail-page-3-${time}`);
  await expect(externalLink.internalUrl.de)
    .toBe(`/de/detail-page-3-${time}`);
  await expect(neccessaryLink.internalUrl.de)
    .toBe(`/de/detail-page-3-${time}`);

});

test('Generates correct links for data privacy checkbox', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const i18nData = await payload.find({
      collection: 'i18nGlobals',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    result = await payload.update({
      collection: 'i18nGlobals',
      data: {
        forms: {
          dataPrivacyCheckbox: {
            dataPrivacyCheckboxText: sampleRteWithLink({
              documentId: detailPage.id,
              slug: 'detailPage',
            }),
          },
        },
      },
      id: i18nData.docs[0].id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  const checkboxLink = result.forms.dataPrivacyCheckbox.dataPrivacyCheckboxText.root.children[0].children[0].fields;

  await expect(checkboxLink.internalUrl.de)
    .toBe(`/de/detail-page-${time}`);

});

test('Generates correct links for header', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const headerData = await payload.find({
      collection: 'header',
    });

    const home = await payload.find({
      collection: 'homePage',
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
      navigationTitle: 'Detail Page',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      title: `Detail Page ${time}`,
    });

    result = await payload.update({
      collection: 'header',
      data: {
        navigation: {
          navItems: [
            {
              navItemText: simpleRteConfig('foo'),
              subNavItems: [
                {
                  navItemLink: {
                    documentId: level2.id,
                    slug: 'detailPage',
                  },
                  navItemText: simpleRteConfig('bar'),
                },
              ],
            },
          ],
        },
      },
      id: headerData.docs[0].id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  const storedUrl = result.navigation.navItems[0].subNavItems[0].navItemLink.url;

  await expect(storedUrl.de)
    .toBe(`/de/overview-page-${time}/detail-page-${time}`);

});

test('Generates correct links pointing to home', {
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

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    result = await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: home.docs[0].id,
              slug: 'homePage',
            }),
          },
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: home.docs[0].id,
                    slug: 'homePage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: detailPage.id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  // check rte links

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields.internalUrl;

  await expect(rteLinkPathFields.de)
    .toBe('/de');

  await expect(rteLinkPathFields.fr)
    .toBe('/fr');

  await expect(rteLinkPathFields.it)
    .toBe('/it');

  await expect(rteLinkPathFields.en)
    .toBe('/en');

  // check linksBlock link

  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink.url;

  await expect(linkBlockLinks.de)
    .toBe('/de');

  await expect(linkBlockLinks.fr)
    .toBe('/fr');

  await expect(linkBlockLinks.it)
    .toBe('/it');

  await expect(linkBlockLinks.en)
    .toBe('/en');

});

test('Generates correct links pointing to impressum', {
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

    const impressum = await payload.find({
      collection: 'impressumPage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    result = await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: impressum.docs[0].id,
              slug: 'impressumPage',
            }),
          },
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: impressum.docs[0].id,
                    slug: 'impressumPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: detailPage.id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  // check rte links

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields.internalUrl;

  await expect(rteLinkPathFields.de)
    .toBe('/de/impressum-de');

  await expect(rteLinkPathFields.fr)
    .toBe('/fr/impressum-fr');

  await expect(rteLinkPathFields.it)
    .toBe('/it/impressum-it');

  await expect(rteLinkPathFields.en)
    .toBe('/en/impressum-en');

  // check linksBlock link

  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink.url;

  console.log(linkBlockLinks);

  await expect(linkBlockLinks.de)
    .toBe('/de/impressum-de');

  await expect(linkBlockLinks.fr)
    .toBe('/fr/impressum-fr');

  await expect(linkBlockLinks.it)
    .toBe('/it/impressum-it');

  await expect(linkBlockLinks.en)
    .toBe('/en/impressum-en');

});

test('Generates correct links pointing to data privacy', {
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

    const dataPrivacy = await payload.find({
      collection: 'dataPrivacyPage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    result = await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: dataPrivacy.docs[0].id,
              slug: 'dataPrivacyPage',
            }),
          },
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: dataPrivacy.docs[0].id,
                    slug: 'dataPrivacyPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: detailPage.id,
      locale: 'de',
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  // check rte links

  const rteLinkPathFields = result.content[0].text.root.children[0].children[0].fields.internalUrl;

  await expect(rteLinkPathFields.de)
    .toBe('/de/data-privacy-de');

  await expect(rteLinkPathFields.fr)
    .toBe('/fr/data-privacy-fr');

  await expect(rteLinkPathFields.it)
    .toBe('/it/data-privacy-it');

  await expect(rteLinkPathFields.en)
    .toBe('/en/data-privacy-en');

  // check linksBlock link

  const linkBlockLinks = result.content[1].links[0].linkInternal.internalLink.url;

  await expect(linkBlockLinks.de)
    .toBe('/de/data-privacy-de');

  await expect(linkBlockLinks.fr)
    .toBe('/fr/data-privacy-fr');

  await expect(linkBlockLinks.it)
    .toBe('/it/data-privacy-it');

  await expect(linkBlockLinks.en)
    .toBe('/en/data-privacy-en');

});
