import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateOverviewPage,
} from '@/test-helpers/page-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { getTenant } from '@/app/providers/TenantProvider.server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

/*
const getCollectionsDocumentForId = async (id: string): Promise<any> => {
  const payload = await getPayloadCached();

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
*/

test.describe('Header/Footer links', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    // let o1Link;
    // let d1Link;
    // let d2Link;
    let headerId;
    let homeId;
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const time = (new Date())
      .getTime();

    try {

      const header = await payload.find({
        collection: 'header',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      headerId = header.docs[0].id;

      // empty header
      await payload.update({
        collection: 'header',
        data: {
          navigation: {},
        },
        id: headerId,
      });

      // #########################################
      // Generate pages to link to
      // #########################################

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      homeId = home.docs[0].id;

      const level1 = await generateOverviewPage({
        navigationTitle: 'o1',
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        title: `o1 ${time}`,
      });

      const detail1 = await generateDetailPage({
        navigationTitle: 'd1',
        parentPage: {
          documentId: level1.id,
          slug: 'overviewPage',
        },
        title: `d1 ${time}`,
      });

      const detail2 = await generateDetailPage({
        navigationTitle: 'd2',
        parentPage: {
          documentId: detail1.id,
          slug: 'detailPage',
        },
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
      // add nav items
      // #########################################
      await payload.update({
        collection: 'header',
        data: {
          navigation: {
            navItems: [
              {
                description: simpleRteConfig('desc'),
                navItemText: simpleRteConfig('text'),
                subNavItems: [
                  {
                    navItemLink: {
                      documentId: level1.id,
                      slug: 'overviewPage',
                    },
                    navItemText: simpleRteConfig('[test]nav-link1:link'),
                  },
                  {
                    navItemLink: {
                      documentId: detail1.id,
                      slug: 'detailPage',
                    },
                    navItemText: simpleRteConfig('[test]nav-link2:link'),
                  },
                  {
                    navItemLink: {
                      documentId: detail2.id,
                      slug: 'detailPage',
                    },
                    navItemText: simpleRteConfig('[test]nav-link3:link'),
                  },
                ],
              },
            ],
          },
        },
        id: headerId,
      });

      // o1Link = await getCollectionsDocumentForId(level1.id);
      // d1Link = await getCollectionsDocumentForId(detail1.id);
      // d2Link = await getCollectionsDocumentForId(detail2.id);

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify entries in Links collection
    // #########################################

    // TODO: enable as soon as reference tracking is done
    /*
    await expect(o1Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(d1Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(d2Link.references[0].pageId)
      .toStrictEqual(homeId);
    */

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto('http://localhost:3000/de');
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

    await expect(link1Header)
      .toStrictEqual(`/de/o1-${time}`);
    await expect(link1Footer)
      .toStrictEqual(`/de/o1-${time}`);

    await expect(link2Header)
      .toStrictEqual(`/de/o1-${time}/d1-${time}`);
    await expect(link2Footer)
      .toStrictEqual(`/de/o1-${time}/d1-${time}`);

    await expect(link3Header)
      .toStrictEqual(`/de/o1-${time}/d1-${time}/d2-${time}`);
    await expect(link3Footer)
      .toStrictEqual(`/de/o1-${time}/d1-${time}/d2-${time}`);

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto('http://localhost:3000/it');
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

    await expect(link1HeaderIt)
      .toStrictEqual(`/it/o1-it-${time}`);
    await expect(link1FooterIt)
      .toStrictEqual(`/it/o1-it-${time}`);

    await expect(link2HeaderIt)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}`);
    await expect(link2FooterIt)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}`);

    await expect(link3HeaderIt)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}/d2-it-${time}`);
    await expect(link3FooterIt)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}/d2-it-${time}`);

  });
});
