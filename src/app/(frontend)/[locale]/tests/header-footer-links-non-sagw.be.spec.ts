// Test if links in header and footer are rendered correctly

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateConsentData,
  generateDataPrivacyPage,
  generateDetailPage,
  generateFooterData,
  generateHomePage,
  generateI18nData,
  generateImpressumPage,
  generateOverviewPage,
} from '@/test-helpers/page-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

test.describe('Header/Footer links (non-sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    let level1;
    let detail1;
    let detail2;
    const time = (new Date())
      .getTime();
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });
    const home = await generateHomePage({
      sideTitle: 'Side Title',
      tenant: tenant.id,
      title: 'Title',
    });
    const homeId = home.id;

    try {
      // #########################################
      // Generate pages to link to
      // #########################################
      level1 = await generateOverviewPage({
        navigationTitle: 'o1',
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant: tenant.id,
        title: `o1 ${time}`,
      });

      detail1 = await generateDetailPage({
        navigationTitle: 'd1',
        parentPage: {
          documentId: level1.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `d1 ${time}`,
      });

      detail2 = await generateDetailPage({
        navigationTitle: 'd2',
        parentPage: {
          documentId: detail1.id,
          slug: 'detailPage',
        },
        tenant: tenant.id,
        title: `d2 ${time}`,
      });

      // #########################################
      // Update with italian
      // #########################################

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`o1-it-${time}`),
          },
          navigationTitle: 'Overview Page it',
        },
        id: level1.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d1-it-${time}`),
          },
          navigationTitle: 'd1 it',
        },
        id: detail1.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d2-it-${time}`),
          },
          navigationTitle: 'd2 it',
        },
        id: detail2.id,
        locale: 'it',
      });

      // #########################################
      // add header data
      // #########################################
      await payload.create({
        collection: 'header',
        data: {
          metanavigation: {
            metaLinks: [
              {
                linkExternal: {
                  externalLink: 'https://www.foo.bar',
                  externalLinkText: simpleRteConfig('Brand Guidelines'),
                },
                linkType: 'external',
              },
            ],
          },
          navigation: {
            navItems: [
              {
                description: simpleRteConfig('Description'),
                navItemText: simpleRteConfig('Text'),
                subNavItems: [
                  {
                    navItemLink: {
                      documentId: home.id,
                      slug: 'homePage',
                    },
                    navItemText: simpleRteConfig('[test]nav-link1:link'),
                  },
                  {
                    navItemLink: {
                      documentId: level1.id,
                      slug: 'overviewPage',
                    },
                    navItemText: simpleRteConfig('[test]nav-link2:link'),
                  },
                  {
                    navItemLink: {
                      documentId: detail1.id,
                      slug: 'detailPage',
                    },
                    navItemText: simpleRteConfig('[test]nav-link3:link'),
                  },
                  {
                    navItemLink: {
                      documentId: detail2.id,
                      slug: 'detailPage',
                    },
                    navItemText: simpleRteConfig('[test]nav-link4:link'),
                  },
                ],
              },
            ],
          },
          tenant: tenant.id,
        },
      });

      // #########################################
      // add remainig home data
      // #########################################
      await generateFooterData({
        tenant: tenant.id,
      });

      await generateI18nData({
        tenant: tenant.id,
      });

      await generateConsentData({
        tenant: tenant.id,
      });

      await generateImpressumPage({
        tenant: tenant.id,
      });

      await generateDataPrivacyPage({
        tenant: tenant.id,
      });
    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify correct url rendering: de
    // #########################################

    await page.goto(`http://localhost:3000/de/tenant-${time}`);
    await page.waitForLoadState('networkidle');
    const link1Header = await page.getByRole('link', {
      name: '[test]nav-link1:link',
    })
      .nth(0)
      .getAttribute('href');
    const link1Footer = await page.getByRole('link', {
      name: '[test]nav-link1:link',
    })
      .nth(1)
      .getAttribute('href');

    const link2Header = await page.getByRole('link', {
      name: '[test]nav-link2:link',
    })
      .nth(0)
      .getAttribute('href');
    const link2Footer = await page.getByRole('link', {
      name: '[test]nav-link2:link',
    })
      .nth(1)
      .getAttribute('href');

    const link3Header = await page.getByRole('link', {
      name: '[test]nav-link3:link',
    })
      .nth(0)
      .getAttribute('href');
    const link3Footer = await page.getByRole('link', {
      name: '[test]nav-link3:link',
    })
      .nth(1)
      .getAttribute('href');

    const link4Header = await page.getByRole('link', {
      name: '[test]nav-link4:link',
    })
      .nth(0)
      .getAttribute('href');
    const link4Footer = await page.getByRole('link', {
      name: '[test]nav-link4:link',
    })
      .nth(1)
      .getAttribute('href');

    await expect(link1Header)
      .toStrictEqual(`/de/tenant-${time}`);
    await expect(link1Footer)
      .toStrictEqual(`/de/tenant-${time}`);

    await expect(link2Header)
      .toStrictEqual(`/de/tenant-${time}/o1-${time}`);
    await expect(link2Footer)
      .toStrictEqual(`/de/tenant-${time}/o1-${time}`);

    await expect(link3Header)
      .toStrictEqual(`/de/tenant-${time}/o1-${time}/d1-${time}`);
    await expect(link3Footer)
      .toStrictEqual(`/de/tenant-${time}/o1-${time}/d1-${time}`);

    await expect(link4Header)
      .toStrictEqual(`/de/tenant-${time}/o1-${time}/d1-${time}/d2-${time}`);
    await expect(link4Footer)
      .toStrictEqual(`/de/tenant-${time}/o1-${time}/d1-${time}/d2-${time}`);

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto(`http://localhost:3000/it/tenant-${time}-it`);
    await page.waitForLoadState('networkidle');

    const link1HeaderIt = await page.getByRole('link', {
      name: '[test]nav-link1:link',
    })
      .nth(0)
      .getAttribute('href');
    const link1FooterIt = await page.getByRole('link', {
      name: '[test]nav-link1:link',
    })
      .nth(1)
      .getAttribute('href');

    const link2HeaderIt = await page.getByRole('link', {
      name: '[test]nav-link2:link',
    })
      .nth(0)
      .getAttribute('href');
    const link2FooterIt = await page.getByRole('link', {
      name: '[test]nav-link2:link',
    })
      .nth(1)
      .getAttribute('href');

    const link3HeaderIt = await page.getByRole('link', {
      name: '[test]nav-link3:link',
    })
      .nth(0)
      .getAttribute('href');
    const link3FooterIt = await page.getByRole('link', {
      name: '[test]nav-link3:link',
    })
      .nth(1)
      .getAttribute('href');

    const link4HeaderIt = await page.getByRole('link', {
      name: '[test]nav-link4:link',
    })
      .nth(0)
      .getAttribute('href');
    const link4FooterIt = await page.getByRole('link', {
      name: '[test]nav-link4:link',
    })
      .nth(1)
      .getAttribute('href');

    await expect(link1HeaderIt)
      .toStrictEqual(`/it/tenant-${time}-it`);
    await expect(link1FooterIt)
      .toStrictEqual(`/it/tenant-${time}-it`);

    await expect(link2HeaderIt)
      .toStrictEqual(`/it/tenant-${time}-it/o1-it-${time}`);
    await expect(link2FooterIt)
      .toStrictEqual(`/it/tenant-${time}-it/o1-it-${time}`);

    await expect(link3HeaderIt)
      .toStrictEqual(`/it/tenant-${time}-it/o1-it-${time}/d1-it-${time}`);
    await expect(link3FooterIt)
      .toStrictEqual(`/it/tenant-${time}-it/o1-it-${time}/d1-it-${time}`);

    await expect(link4HeaderIt)
      .toStrictEqual(`/it/tenant-${time}-it/o1-it-${time}/d1-it-${time}/d2-it-${time}`);
    await expect(link4FooterIt)
      .toStrictEqual(`/it/tenant-${time}-it/o1-it-${time}/d1-it-${time}/d2-it-${time}`);

  });
});
