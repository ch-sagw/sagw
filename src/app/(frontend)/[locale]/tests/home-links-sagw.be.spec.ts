import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateOverviewPage,
} from '@/test-helpers/page-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { getTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';

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

/**
 * Exhaustive test:
 * - add all possible blocks to home
 * - add links to different pages in all possible places (hero and blocks)
 * and test if they are rendered properly in the frontend
 * - add italian slugs to all linked pages and test links are properly rendered
 * in italian frontend page
 * - check if Links collection has all required references
 */

test.describe('Home links (sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    // let d1Link;
    let d2Link;
    let d3Link;
    let d4Link;
    let d5Link;
    let d6Link;
    let d7Link;
    // let d8Link;
    let d9Link;
    let homeId;
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const time = (new Date())
      .getTime();

    try {

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const i18nGlobals = await payload.find({
        collection: 'i18nGlobals',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      // empty homepage
      await payload.update({
        collection: 'homePage',
        data: {
          content: [],
        },
        id: home.docs[0].id,
      });

      homeId = home.docs[0].id;

      // #########################################
      // Generate pages to link to
      // #########################################

      const level1a = await generateOverviewPage({
        navigationTitle: 'Overview Page',
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        title: `Overview Page 1 ${time}`,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`overview-page-1-it-${time}`),
          },
          navigationTitle: 'Overview Page it',
        },
        id: level1a.id,
        locale: 'it',
      });

      const detail1 = await generateDetailPage({
        navigationTitle: 'd1',
        parentPage: {
          documentId: level1a.id,
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

      const detail3 = await generateDetailPage({
        navigationTitle: 'd3',
        parentPage: {
          documentId: detail2.id,
          slug: 'detailPage',
        },
        title: `d3 ${time}`,
      });

      const detail4 = await generateDetailPage({
        navigationTitle: 'd4',
        parentPage: {
          documentId: detail3.id,
          slug: 'detailPage',
        },
        title: `d4 ${time}`,
      });

      const detail5 = await generateDetailPage({
        navigationTitle: 'd5',
        parentPage: {
          documentId: detail4.id,
          slug: 'detailPage',
        },
        title: `d5 ${time}`,
      });

      const detail6 = await generateDetailPage({
        navigationTitle: 'd6',
        parentPage: {
          documentId: detail5.id,
          slug: 'detailPage',
        },
        title: `d6 ${time}`,
      });

      const detail7 = await generateDetailPage({
        navigationTitle: 'd7',
        parentPage: {
          documentId: detail6.id,
          slug: 'detailPage',
        },
        title: `d7 ${time}`,
      });

      const detail8 = await generateDetailPage({
        navigationTitle: 'd8',
        parentPage: {
          documentId: detail7.id,
          slug: 'detailPage',
        },
        title: `d8 ${time}`,
      });

      const detail9 = await generateDetailPage({
        navigationTitle: 'd9',
        parentPage: {
          documentId: detail8.id,
          slug: 'detailPage',
        },
        title: `d9 ${time}`,
      });

      // #########################################
      // Update with italian
      // #########################################

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

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d3-it-${time}`),
          },
          navigationTitle: 'd3 it',
        },
        id: detail3.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d4-it-${time}`),
          },
          navigationTitle: 'd4 it',
        },
        id: detail4.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d5-it-${time}`),
          },
          navigationTitle: 'd5 it',
        },
        id: detail5.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d6-it-${time}`),
          },
          navigationTitle: 'd6 it',
        },
        id: detail6.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d7-it-${time}`),
          },
          navigationTitle: 'd7 it',
        },
        id: detail7.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d8-it-${time}`),
          },
          navigationTitle: 'd8 it',
        },
        id: detail8.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d9-it-${time}`),
          },
          navigationTitle: 'd9 it',
        },
        id: detail9.id,
        locale: 'it',
      });

      // #########################################
      // Get ids of data privacy and impressum to link to
      // #########################################
      const dataPrivacyDocs = await payload.find({
        collection: 'dataPrivacyPage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const impressumDocs = await payload.find({
        collection: 'impressumPage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      // #########################################
      // add form
      // #########################################
      const newsletterForm = await payload.create({
        collection: 'forms',
        data: {
          colorMode: 'dark',
          isNewsletterForm: 'newsletter',
          newsletterFields: {
            actionText: 'Erneut senden',
            email: {
              fieldError: simpleRteConfig('Bitte geben Sie die E-Mail Adresse an.'),
              fieldWidth: 'full',
              label: simpleRteConfig('E-Mail'),
              placeholder: 'Ihre E-Mail Adresse',
            },
            firstName: {
              fieldError: simpleRteConfig('Bitte geben Sie Ihren Vornamen an.'),
              fieldWidth: 'half',
              label: simpleRteConfig('Vorname'),
              placeholder: 'Ihr Vorname',
            },
            includeLanguageSelection: 'yes',
            lastName: {
              fieldError: simpleRteConfig('Bitte geben Sie Ihren Nachnamen an.'),
              fieldWidth: 'half',
              label: simpleRteConfig('Nachname'),
              placeholder: 'Ihr Nachname',
            },
          },
          recipientMail: 'delivered@resend.dev',
          showPrivacyCheckbox: true,
          submitButtonLabel: 'Abschicken',
          submitError: {
            text: simpleRteConfig('Newsletter Submit text error'),
            title: simpleRteConfig('Newsletter Submit title error'),
          },
          submitSuccess: {
            text: simpleRteConfig('Newsletter Submit text success'),
            title: simpleRteConfig('Newsletter Submit title success'),
          },
          subtitle: simpleRteConfig('Subtitle for Newsletter Form'),
          tenant,
          title: simpleRteConfig('Newsletter Form'),
        },
      });

      await payload.update({
        collection: 'i18nGlobals',
        data: {
          ...i18nGlobals.docs[0],
          forms: {
            dataPrivacyCheckbox: {
              dataPrivacyCheckboxText: sampleRteWithLink({
                documentId: detail1.id,
                slug: 'detailPage',
                text: '[test]data-privacy-checkbox:link',
              }),
              errorMessage: simpleRteConfig('Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen'),
            },
          },
        },
        id: i18nGlobals.docs[0].id,
      });

      // #########################################
      // add content to home
      // #########################################

      await payload.update({
        collection: 'homePage',
        data: {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: detail2.id,
                slug: 'detailPage',
                text: '[test]rte:link',
              }),
            },
            {
              blockType: 'formBlock',
              form: newsletterForm,
            },
            {
              blockType: 'homeTeasersBlock',
              homeTeasers: [
                {
                  category: 'Förderung',
                  iconName: 'bar',
                  link: {
                    internalLink: {
                      documentId: detail4.id,
                      slug: 'detailPage',
                    },
                    linkText: simpleRteConfig('[test]homeTeaser:link'),
                  },
                  text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
                  title: simpleRteConfig('Wir schaffen verlässliche Grundlagen für geistes- und sozialwissenschaftliche Forschung in der Schweiz.'),
                },
              ],
            },
            {
              blockType: 'eventsTeasersBlock',
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail5.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]eventsTeasers:link'),
                },
              },
              title: simpleRteConfig('Events'),
            },
            {
              blockType: 'newsTeasersBlock',
              colorMode: 'light',
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail6.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]newsTeasers:link'),
                },
              },
              title: simpleRteConfig('News'),
            },
            {
              blockType: 'magazineTeasersBlock',
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail7.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]magazineTeasers:link'),
                },
              },
              title: simpleRteConfig('News'),
            },

            // enable as soon as available
            // {
            //   blockType: 'publicationsTeasersBlock',
            //   optionalLink: {
            //     includeLink: true,
            //     link: {
            //       internalLink: {
            //         documentId: detail8.id,
            //         slug: 'detailPage',
            //       },
            //       linkText: simpleRteConfig(''),
            //     },
            //   },
            //   title: simpleRteConfig('News'),
            // },
            {
              blockType: 'projectsTeasersBlock',
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail9.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]projectsTeasers:link'),
                },
              },
              title: simpleRteConfig('News'),
            },
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: dataPrivacyDocs.docs[0].id,
                slug: 'dataPrivacyPage',
                text: '[test]dataPrivacy:link',
              }),
            },
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: impressumDocs.docs[0].id,
                slug: 'impressumPage',
                text: '[test]impressum:link',
              }),
            },
          ],
          hero: {
            optionalLink: {
              includeLink: true,
              link: {
                internalLink: {
                  documentId: detail3.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('[test]hero:optionalLink'),
              },
            },
          },
        },
        id: homeId,
      });

      // d1Link = await getCollectionsDocumentForId(detail1.id);
      d2Link = await getCollectionsDocumentForId(detail2.id);
      d3Link = await getCollectionsDocumentForId(detail3.id);
      d4Link = await getCollectionsDocumentForId(detail4.id);
      d5Link = await getCollectionsDocumentForId(detail5.id);
      d6Link = await getCollectionsDocumentForId(detail6.id);
      d7Link = await getCollectionsDocumentForId(detail7.id);
      // d8Link = await getCollectionsDocumentForId(detail8.id);
      d9Link = await getCollectionsDocumentForId(detail9.id);

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify entries in Links collection
    // #########################################

    // await expect(d1Link.references[0].pageId)
    //   .toStrictEqual(homeId);
    await expect(d2Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(d3Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(d4Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(d5Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(d6Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(d7Link.references[0].pageId)
      .toStrictEqual(homeId);
    // await expect(d8Link.references[0].pageId)
    //   .toStrictEqual(homeId);
    await expect(d9Link.references[0].pageId)
      .toStrictEqual(homeId);

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');

    const heroLink = await page.getByRole('link', {
      name: '[test]hero:optionalLink',
    })
      .getAttribute('href');

    const rteLink = await page.getByRole('link', {
      name: '[test]rte:link',
    })
      .getAttribute('href');

    const formCheckboxLink = await page.getByRole('link', {
      name: '[test]data-privacy-checkbox:link',
    })
      .getAttribute('href');

    const homeTeaserLink = await page.getByRole('link', {
      name: '[test]homeTeaser:link',
    })
      .getAttribute('href');

    const eventsTeasersLink = await page.getByRole('link', {
      name: '[test]eventsTeasers:link',
    })
      .getAttribute('href');

    const newsTeasersLink = await page.getByRole('link', {
      name: '[test]newsTeasers:link',
    })
      .getAttribute('href');

    const magazineTeasersLink = await page.getByRole('link', {
      name: '[test]magazineTeasers:link',
    })
      .getAttribute('href');

    // const publicationsTeasersLink = await page.getByRole('link', {
    //   name: '[test]publicationsTeasers:link',
    // })
    //   .getAttribute('href');

    const projectsTeasersLink = await page.getByRole('link', {
      name: '[test]projectsTeasers:link',
    })
      .getAttribute('href');

    const dataPrivacyLink = await page.getByRole('link', {
      name: '[test]dataPrivacy:link',
    })
      .getAttribute('href');

    const impressumLink = await page.getByRole('link', {
      name: '[test]impressum:link',
    })
      .getAttribute('href');

    await expect(formCheckboxLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}`);
    await expect(rteLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}`);
    await expect(heroLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}`);
    await expect(homeTeaserLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}`);

    await expect(eventsTeasersLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}`);
    await expect(newsTeasersLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}/d6-${time}`);
    await expect(magazineTeasersLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}/d6-${time}/d7-${time}`);
    // await expect(publicationsTeasersLink)
    //   .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}
    // /d4-${time}/d5-${time}/d6-${time}/d7-${time}/d8-${time}`);
    await expect(projectsTeasersLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}/d6-${time}/d7-${time}/d8-${time}/d9-${time}`);

    await expect(dataPrivacyLink)
      .toBe('/de/data-privacy-de');
    await expect(impressumLink)
      .toBe('/de/impressum-de');

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto('http://localhost:3000/it');
    await page.waitForLoadState('networkidle');

    const heroLinkIt = await page.getByRole('link', {
      name: '[test]hero:optionalLink',
    })
      .getAttribute('href');

    const rteLinkIt = await page.getByRole('link', {
      name: '[test]rte:link',
    })
      .getAttribute('href');

    const formCheckboxLinkIt = await page.getByRole('link', {
      name: '[test]data-privacy-checkbox:link',
    })
      .getAttribute('href');

    const homeTeaserLinkIt = await page.getByRole('link', {
      name: '[test]homeTeaser:link',
    })
      .getAttribute('href');

    const eventsTeasersLinkIt = await page.getByRole('link', {
      name: '[test]eventsTeasers:link',
    })
      .getAttribute('href');

    const newsTeasersLinkIt = await page.getByRole('link', {
      name: '[test]newsTeasers:link',
    })
      .getAttribute('href');

    const magazineTeasersLinkIt = await page.getByRole('link', {
      name: '[test]magazineTeasers:link',
    })
      .getAttribute('href');

    // const publicationsTeasersLink = await page.getByRole('link', {
    //   name: '[test]publicationsTeasers:link',
    // })
    //   .getAttribute('href');

    const projectsTeasersLinkIt = await page.getByRole('link', {
      name: '[test]projectsTeasers:link',
    })
      .getAttribute('href');

    const dataPrivacyLinkIt = await page.getByRole('link', {
      name: '[test]dataPrivacy:link',
    })
      .getAttribute('href');

    const impressumLinkIt = await page.getByRole('link', {
      name: '[test]impressum:link',
    })
      .getAttribute('href');

    await expect(formCheckboxLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}`);
    await expect(rteLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}`);
    await expect(heroLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}`);
    await expect(homeTeaserLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}`);

    await expect(eventsTeasersLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}`);
    await expect(newsTeasersLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}/d6-it-${time}`);
    await expect(magazineTeasersLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}/d6-it-${time}/d7-it-${time}`);
    // await expect(publicationsTeasersLinkIt)
    //   .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/
    // d3-it-${time}
    // /d4-it-${time}/d5-it-${time}/d6-it-${time}/d7-it-${time}/d8-${time}`);
    await expect(projectsTeasersLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}/d6-it-${time}/d7-it-${time}/d8-it-${time}/d9-it-${time}`);

    await expect(dataPrivacyLinkIt)
      .toBe('/it/data-privacy-it');
    await expect(impressumLinkIt)
      .toBe('/it/impressum-it');

  });
});
