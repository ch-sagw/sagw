/**
 * Exhaustive test:
 * - add all possible blocks to overview page
 * - add links to different pages in all possible places
 * and test if they are rendered properly in the frontend
 * - add italian slugs to all linked pages and test links are properly rendered
 * in italian frontend page
 * - check if Links collection has all required references
 */

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateEventDetailPage,
  generateInstituteDetailPage,
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
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

test.describe('Overview page regular links (sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    let detail1;
    let detail2;
    let detail3;
    let detail4;
    let detail5;
    let statusMessage;
    let overviewPage;
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

      overviewPage = await generateOverviewPage({
        navigationTitle: 'Overview Page',
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        title: `Overview Page ${time}`,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`overview page it ${time}`),
          },
          navigationTitle: 'Overview Page it',
        },
        id: overviewPage.id,
        locale: 'it',
      });

      const i18nGlobals = await payload.find({
        collection: 'i18nGlobals',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      // #########################################
      // Generate pages to link to
      // #########################################

      detail1 = await generateDetailPage({
        navigationTitle: 'd1',
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        title: `d1 ${time}`,
      });

      detail2 = await generateDetailPage({
        navigationTitle: 'd2',
        parentPage: {
          documentId: detail1.id,
          slug: 'detailPage',
        },
        title: `d2 ${time}`,
      });

      detail3 = await generateDetailPage({
        navigationTitle: 'd3',
        parentPage: {
          documentId: detail2.id,
          slug: 'detailPage',
        },
        title: `d3 ${time}`,
      });

      detail4 = await generateDetailPage({
        navigationTitle: 'd4',
        parentPage: {
          documentId: detail3.id,
          slug: 'detailPage',
        },
        title: `d4 ${time}`,
      });

      detail5 = await generateDetailPage({
        navigationTitle: 'd5',
        parentPage: {
          documentId: detail4.id,
          slug: 'detailPage',
        },
        title: `d5 ${time}`,
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
      // Enable global status message
      // #########################################
      statusMessage = await payload.find({
        collection: 'statusMessage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      await payload.update({
        collection: 'statusMessage',
        data: {
          ...statusMessage,
          content: {
            optionalLink: {
              includeLink: true,
              link: {
                internalLink: {
                  documentId: detail1.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('[test]status-message:link'),
              },
            },
            showOnHomeOnly: false,
          },
        },
        id: statusMessage.docs[0].id,
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
          subtitle: simpleRteConfig('Subtitle'),
          tenant,
          title: simpleRteConfig(`form-${time}`),
        },
      });

      await payload.update({
        collection: 'i18nGlobals',
        data: {
          ...i18nGlobals.docs[0],
          forms: {
            dataPrivacyCheckbox: {
              dataPrivacyCheckboxText: sampleRteWithLink({
                documentId: detail2.id,
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
      // add content to overviewPage
      // #########################################

      await payload.update({
        collection: 'overviewPage',
        data: {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: detail3.id,
                slug: 'detailPage',
                text: '[test]rte:link',
              }),
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
            {
              accordions: [
                {
                  accordionContent: sampleRteWithLink({
                    documentId: detail4.id,
                    slug: 'detailPage',
                    text: '[test]accordion:link',
                  }),
                  accordionTitle: simpleRteConfig('Accordion 1'),
                },
              ],
              blockType: 'accordionBlock',
              colorMode: 'white',
              title: simpleRteConfig('Accordion title'),
            },
            {
              blockType: 'formBlock',
              form: newsletterForm.id,
            },
            {
              blockType: 'notificationBlock',
              text: sampleRteWithLink({
                documentId: detail5.id,
                slug: 'detailPage',
                text: '[test]notification:link',
              }),
            },
          ],
          hero: overviewPage.hero,
        },
        id: overviewPage.id,
      });

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify entries in Links collection
    // #########################################

    const d1Link = await getCollectionsDocumentForId(detail1.id);
    const d2Link = await getCollectionsDocumentForId(detail2.id);
    const d3Link = await getCollectionsDocumentForId(detail3.id);
    const d4Link = await getCollectionsDocumentForId(detail4.id);
    const d5Link = await getCollectionsDocumentForId(detail5.id);

    await expect(d1Link.references[0].pageId)
      .toStrictEqual(statusMessage.docs[0].id);
    await expect(d2Link.references.some((ref: any) => ref.pageId === overviewPage.id))
      .toBe(true);
    await expect(d3Link.references[0].pageId)
      .toStrictEqual(overviewPage.id);
    await expect(d4Link.references[0].pageId)
      .toStrictEqual(overviewPage.id);
    await expect(d5Link.references[0].pageId)
      .toStrictEqual(overviewPage.id);

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const statusMessageLink = await page.getByRole('link', {
      name: '[test]status-message:link',
    })
      .getAttribute('href');

    const checkboxLink = await page.getByRole('link', {
      name: '[test]data-privacy-checkbox:link',
    })
      .getAttribute('href');

    const rteLink1 = await page.getByRole('link', {
      name: '[test]rte:link',
    })
      .getAttribute('href');

    const accordionButton = await page.getByText('Accordion 1');

    await accordionButton.click();

    const accordionLink = await page.getByRole('link', {
      name: '[test]accordion:link',
    })
      .getAttribute('href');
    const notificationLink = await page.getByRole('link', {
      name: '[test]notification:link',
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

    await expect(statusMessageLink)
      .toBe(`/de/overview-page-${time}/d1-${time}`);

    await expect(checkboxLink)
      .toBe(`/de/overview-page-${time}/d1-${time}/d2-${time}`);

    await expect(rteLink1)
      .toBe(`/de/overview-page-${time}/d1-${time}/d2-${time}/d3-${time}`);

    await expect(accordionLink)
      .toBe(`/de/overview-page-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}`);

    await expect(notificationLink)
      .toBe(`/de/overview-page-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}`);

    await expect(dataPrivacyLink)
      .toBe('/de/data-privacy-de');

    await expect(impressumLink)
      .toBe('/de/impressum-de');

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const statusMessageLinkIt = await page.getByRole('link', {
      name: '[test]status-message:link',
    })
      .getAttribute('href');

    const checkboxLinkIt = await page.getByRole('link', {
      name: '[test]data-privacy-checkbox:link',
    })
      .getAttribute('href');

    const rteLink1It = await page.getByRole('link', {
      name: '[test]rte:link',
    })
      .getAttribute('href');

    const accordionButtonIt = await page.getByText('Accordion 1');

    await accordionButtonIt.click();

    const accordionLinkIt = await page.getByRole('link', {
      name: '[test]accordion:link',
    })
      .getAttribute('href');
    const notificationLinkIt = await page.getByRole('link', {
      name: '[test]notification:link',
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

    await expect(statusMessageLinkIt)
      .toBe(`/it/overview-page-it-${time}/d1-it-${time}`);

    await expect(checkboxLinkIt)
      .toBe(`/it/overview-page-it-${time}/d1-it-${time}/d2-it-${time}`);

    await expect(rteLink1It)
      .toBe(`/it/overview-page-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}`);

    await expect(accordionLinkIt)
      .toBe(`/it/overview-page-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}`);

    await expect(notificationLinkIt)
      .toBe(`/it/overview-page-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}`);

    await expect(dataPrivacyLinkIt)
      .toBe('/it/data-privacy-it');

    await expect(impressumLinkIt)
      .toBe('/it/impressum-it');

    // #########################################
    // test removal
    // #########################################
    // remove all content and verify that link references are removed

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [],
      },
      id: overviewPage.id,
    });

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: overviewPage.id,
                slug: 'overviewPage',
              },
              linkText: simpleRteConfig('[test]status-message:link'),
            },
          },
          showOnHomeOnly: false,
        },
      },
      id: statusMessage.docs[0].id,
    });

    const d1LinkUpdated = await getCollectionsDocumentForId(detail1.id);
    const d2LinkUpdated = await getCollectionsDocumentForId(detail2.id);
    const d3LinkUpdated = await getCollectionsDocumentForId(detail3.id);
    const d4LinkUpdated = await getCollectionsDocumentForId(detail4.id);
    const d5LinkUpdated = await getCollectionsDocumentForId(detail5.id);

    await expect(d1LinkUpdated.references.some((ref: any) => ref.pageId === statusMessage.docs[0].id))
      .toBe(false);
    await expect(d2LinkUpdated.references.some((ref: any) => ref.pageId === overviewPage.id))
      .toBe(false);
    await expect(d3LinkUpdated.references.some((ref: any) => ref.pageId === overviewPage.id))
      .toBe(false);
    await expect(d4LinkUpdated.references.some((ref: any) => ref.pageId === overviewPage.id))
      .toBe(false);
    await expect(d5LinkUpdated.references.some((ref: any) => ref.pageId === overviewPage.id))
      .toBe(false);
  });
});

test.describe('Overview page overview-block links (sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    let projectPage;
    let magazinePage;
    let publicationPage;
    let eventPage;
    let newsPage;
    let institutePage;
    let nationalDictionaryPage;
    let overviewPage;
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const tenantId = tenant
      ? tenant
      : '';
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

      overviewPage = await generateOverviewPage({
        navigationTitle: 'Overview Page',
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        title: `Overview Page ${time}`,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`overview page it ${time}`),
          },
          navigationTitle: 'Overview Page it',
        },
        id: overviewPage.id,
        locale: 'it',
      });

      // #########################################
      // Pages for teasers / overviews
      // #########################################

      projectPage = await generateProjectDetailPage({
        locale: 'de',
        navigationTitle: `project ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `project ${time}`,
      });

      magazinePage = await generateMagazineDetailPage({
        date: '2031-08-01T12:00:00.000Z',
        locale: 'de',
        navigationTitle: `magazine ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `magazine ${time}`,
      });

      publicationPage = await generatePublicationDetailPage({
        locale: 'de',
        navigationTitle: `publication ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `publication ${time}`,
      });

      eventPage = await generateEventDetailPage({
        date: '2029-08-03T12:00:00.000Z',
        locale: 'de',
        navigationTitle: `event ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `event ${time}`,
      });

      newsPage = await generateNewsDetailPage({
        date: '2031-08-02T12:00:00.000Z',
        locale: 'de',
        navigationTitle: `news ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `news ${time}`,
      });

      institutePage = await generateInstituteDetailPage({
        locale: 'de',
        navigationTitle: `institute ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `institute ${time}`,
      });

      nationalDictionaryPage = await generateNationalDictionaryDetailPage({
        locale: 'de',
        navigationTitle: `national dictionary ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `national dictionary ${time}`,
      });

      // #########################################
      // update teasers pages with italian
      // #########################################
      await payload.update({
        collection: 'projectDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`project it ${time}`),
          },
          overviewPageProps: projectPage.overviewPageProps,
          project: projectPage.project,
        },
        id: projectPage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'magazineDetailPage',
        data: {
          hero: {
            ...magazinePage.hero,
            title: simpleRteConfig(`magazine it ${time}`),
          },
          overviewPageProps: magazinePage.overviewPageProps,
        },
        id: magazinePage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'publicationDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`publication it ${time}`),
          },
          overviewPageProps: publicationPage.overviewPageProps,
        },
        id: publicationPage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'eventDetailPage',
        data: {
          eventDetails: {
            title: simpleRteConfig(`event it ${time}`),
          },
        },
        id: eventPage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'newsDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`news it ${time}`),
          },
          overviewPageProps: newsPage.overviewPageProps,
        },
        id: newsPage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'instituteDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`institute it ${time}`),
          },
          overviewPageProps: institutePage.overviewPageProps,
        },
        id: institutePage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'nationalDictionaryDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`national dictionary it ${time}`),
          },
          overviewPageProps: nationalDictionaryPage.overviewPageProps,
        },
        id: nationalDictionaryPage.id,
        locale: 'it',
      });

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // Test events overview
    // #########################################

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'eventsOverviewBlock',
            title: simpleRteConfig('Title'),
          },
        ],
        hero: overviewPage.hero,
      },
      id: overviewPage.id,
    });

    // de

    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const eventLink = await page.getByRole('link', {
      name: `event ${time}`,
    })
      .getAttribute('href');

    await expect(eventLink)
      .toStrictEqual(`/de/overview-page-${time}/event-${time}`);

    // it

    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const eventLinkIt = await page.getByRole('link', {
      name: `event it ${time}`,
    })
      .getAttribute('href');

    await expect(eventLinkIt)
      .toStrictEqual(`/it/overview-page-it-${time}/event-it-${time}`);

    // #########################################
    // Test news overview
    // #########################################

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'newsOverviewBlock',
            title: simpleRteConfig('Title'),
          },
        ],
        hero: overviewPage.hero,
      },
      id: overviewPage.id,
    });

    // de

    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const newsLink = await page.getByRole('link', {
      name: `news ${time}`,
    })
      .getAttribute('href');

    await expect(newsLink)
      .toStrictEqual(`/de/overview-page-${time}/news-${time}`);

    // it

    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const newsLinkIt = await page.getByRole('link', {
      name: `news it ${time}`,
    })
      .getAttribute('href');

    await expect(newsLinkIt)
      .toStrictEqual(`/it/overview-page-it-${time}/news-it-${time}`);

    // #########################################
    // Test projects overview
    // #########################################

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'projectsOverviewBlock',
          },
        ],
        hero: overviewPage.hero,
      },
      id: overviewPage.id,
    });

    // de

    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const projectLink = await page.getByRole('link', {
      name: `project ${time}`,
    })
      .getAttribute('href');

    await expect(projectLink)
      .toStrictEqual(`/de/overview-page-${time}/project-${time}`);

    // it

    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const projectLinkIt = await page.getByRole('link', {
      name: `project it ${time}`,
    })
      .getAttribute('href');

    await expect(projectLinkIt)
      .toStrictEqual(`/it/overview-page-it-${time}/project-it-${time}`);

    // #########################################
    // Test magazine overview
    // #########################################

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'magazineOverviewBlock',
          },
        ],
        hero: overviewPage.hero,
      },
      id: overviewPage.id,
    });

    // de

    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const magazineLink = await page.getByRole('link', {
      name: `magazine ${time}`,
    })
      .getAttribute('href');

    await expect(magazineLink)
      .toStrictEqual(`/de/overview-page-${time}/magazine-${time}`);

    // it

    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const magazineLinkIt = await page.getByRole('link', {
      name: `magazine it ${time}`,
    })
      .getAttribute('href');

    await expect(magazineLinkIt)
      .toStrictEqual(`/it/overview-page-it-${time}/magazine-it-${time}`);

    // #########################################
    // Test institutes overview
    // #########################################

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'institutesOverviewBlock',
            moreInfoButtonText: simpleRteConfig('More'),
          },
        ],
        hero: overviewPage.hero,
      },
      id: overviewPage.id,
    });

    // de

    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const instituteLink = await page.getByRole('link', {
      name: `institute ${time}`,
    })
      .getAttribute('href');

    await expect(instituteLink)
      .toStrictEqual(`/de/overview-page-${time}/institute-${time}`);

    // it

    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const instituteLinkIt = await page.getByRole('link', {
      name: `institute it ${time}`,
    })
      .getAttribute('href');

    await expect(instituteLinkIt)
      .toStrictEqual(`/it/overview-page-it-${time}/institute-it-${time}`);

    // #########################################
    // Test national dictionaries overview
    // #########################################

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'nationalDictionariesOverviewBlock',
            moreInfoButtonText: simpleRteConfig('More'),
          },
        ],
        hero: overviewPage.hero,
      },
      id: overviewPage.id,
    });

    // de

    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const nationalDictionaryLink = await page.getByRole('link', {
      name: `national dictionary ${time}`,
    })
      .getAttribute('href');

    await expect(nationalDictionaryLink)
      .toStrictEqual(`/de/overview-page-${time}/national-dictionary-${time}`);

    // it

    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const nationalDictionaryLinkIt = await page.getByRole('link', {
      name: `national dictionary it ${time}`,
    })
      .getAttribute('href');

    await expect(nationalDictionaryLinkIt)
      .toStrictEqual(`/it/overview-page-it-${time}/national-dictionary-it-${time}`);

    // #########################################
    // cleanup
    // #########################################
    await payload.delete({
      collection: 'projectDetailPage',
      id: projectPage.id,
    });

    await payload.delete({
      collection: 'magazineDetailPage',
      id: magazinePage.id,
    });

    await payload.delete({
      collection: 'publicationDetailPage',
      id: publicationPage.id,
    });

    await payload.delete({
      collection: 'eventDetailPage',
      id: eventPage.id,
    });

    await payload.delete({
      collection: 'newsDetailPage',
      id: newsPage.id,
    });

    await payload.delete({
      collection: 'instituteDetailPage',
      id: institutePage.id,
    });

    await payload.delete({
      collection: 'nationalDictionaryDetailPage',
      id: nationalDictionaryPage.id,
    });
  });
});

test.describe('Overview page teasers links (sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    let projectPage;
    let magazinePage;
    let eventPage;
    let newsPage;
    let detail1;
    let overviewPage;
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const tenantId = tenant
      ? tenant
      : '';
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

      // homeId = home.docs[0].id;

      overviewPage = await generateOverviewPage({
        navigationTitle: 'Overview Page',
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        title: `Overview Page ${time}`,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`overview page it ${time}`),
          },
          navigationTitle: 'Overview Page it',
        },
        id: overviewPage.id,
        locale: 'it',
      });

      // #########################################
      // Generate pages to link to
      // #########################################

      detail1 = await generateDetailPage({
        navigationTitle: 'd1',
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        title: `d1 ${time}`,
      });

      // #########################################
      // Pages for teasers / overviews
      // #########################################
      projectPage = await generateProjectDetailPage({
        locale: 'de',
        navigationTitle: `project ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `project ${time}`,
      });

      magazinePage = await generateMagazineDetailPage({
        date: '2031-08-01T12:00:00.000Z',
        locale: 'de',
        navigationTitle: `magazine ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `magazine ${time}`,
      });

      eventPage = await generateEventDetailPage({
        date: '2029-08-03T12:00:00.000Z',
        locale: 'de',
        navigationTitle: `event ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `event ${time}`,
      });

      newsPage = await generateNewsDetailPage({
        date: '2031-08-02T12:00:00.000Z',
        locale: 'de',
        navigationTitle: `news ${time}`,
        parentPage: {
          documentId: overviewPage.id,
          slug: 'overviewPage',
        },
        tenant: tenantId,
        title: `news ${time}`,
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

      // #########################################
      // update teasers pages with italian
      // #########################################
      await payload.update({
        collection: 'projectDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`project it ${time}`),
          },
          overviewPageProps: projectPage.overviewPageProps,
          project: projectPage.project,
        },
        id: projectPage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'magazineDetailPage',
        data: {
          hero: {
            ...magazinePage.hero,
            title: simpleRteConfig(`magazine it ${time}`),
          },
          overviewPageProps: magazinePage.overviewPageProps,
        },
        id: magazinePage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'eventDetailPage',
        data: {
          eventDetails: {
            title: simpleRteConfig(`event it ${time}`),
          },
        },
        id: eventPage.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'newsDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`news it ${time}`),
          },
          overviewPageProps: newsPage.overviewPageProps,
        },
        id: newsPage.id,
        locale: 'it',
      });

      // #########################################
      // add content to overviewPage
      // #########################################

      const image = await payload.create({
        collection: 'images',
        data: {
          alt: `image-${time}`,
          tenant: tenant
            ? tenant
            : '',
        },
        filePath: 'src/seed/test-data/assets/sagw.png',
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          content: [
            {
              alignement: 'horizontal',
              blockType: 'genericTeasersBlock',
              lead: simpleRteConfig('Lead'),
              teasers: [
                {
                  image: {
                    relationTo: 'images',
                    value: image.id,
                  },
                  linkInternal: {
                    internalLink: {
                      documentId: detail1.id,
                      slug: 'detailPage',
                    },
                    linkText: simpleRteConfig('[test]generic-teaser:link'),
                  },
                  linkType: 'internal',
                  text: simpleRteConfig('text'),
                  title: simpleRteConfig('title'),
                },
              ],
              title: simpleRteConfig('Generic Teaser'),
            },
            {
              alignement: 'vertical',
              blockType: 'projectsTeasersBlock',
              lead: simpleRteConfig('Lead'),
              title: simpleRteConfig('Title'),
            },
            {
              blockType: 'eventsTeasersBlock',
              title: simpleRteConfig('Events'),
            },
            {
              alignement: 'horizontal',
              blockType: 'magazineTeasersBlock',
              lead: simpleRteConfig('Lead'),
              title: simpleRteConfig('Title'),
            },
            {
              blockType: 'newsTeasersBlock',
              colorMode: 'light',
              title: simpleRteConfig('Title'),
            },
          ],
          hero: overviewPage.hero,
        },
        id: overviewPage.id,
      });

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify entries in Links collection
    // #########################################

    const d1Link = await getCollectionsDocumentForId(detail1.id);

    await expect(d1Link.references[0].pageId)
      .toStrictEqual(overviewPage.id);

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto(`http://localhost:3000/de/overview-page-${time}`);
    await page.waitForLoadState('networkidle');

    const genericLink = await page.getByRole('link', {
      name: '[test]generic-teaser:link',
    })
      .getAttribute('href');

    const projectLink = await page.getByRole('link', {
      name: `project ${time}`,
    })
      .getAttribute('href');

    const magazineLink = await page.getByRole('link', {
      name: `magazine ${time}`,
    })
      .getAttribute('href');

    const eventLink = await page.getByRole('link', {
      name: `event ${time}`,
    })
      .getAttribute('href');

    const newsLink = await page.getByRole('link', {
      name: `news ${time}`,
    })
      .getAttribute('href');

    await expect(genericLink)
      .toBe(`/de/overview-page-${time}/d1-${time}`);

    await expect(projectLink)
      .toBe(`/de/overview-page-${time}/project-${time}`);

    await expect(eventLink)
      .toBe(`/de/overview-page-${time}/event-${time}`);

    await expect(newsLink)
      .toBe(`/de/overview-page-${time}/news-${time}`);

    await expect(magazineLink)
      .toBe(`/de/overview-page-${time}/magazine-${time}`);

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto(`http://localhost:3000/it/overview-page-it-${time}`);
    await page.waitForLoadState('networkidle');

    const genericLinkIt = await page.getByRole('link', {
      name: '[test]generic-teaser:link',
    })
      .getAttribute('href');

    const projectLinkIt = await page.getByRole('link', {
      name: `project it ${time}`,
    })
      .getAttribute('href');

    const magazineLinkIt = await page.getByRole('link', {
      name: `magazine it ${time}`,
    })
      .getAttribute('href');

    const eventLinkIt = await page.getByRole('link', {
      name: `event it ${time}`,
    })
      .getAttribute('href');

    const newsLinkIt = await page.getByRole('link', {
      name: `news it ${time}`,
    })
      .getAttribute('href');

    await expect(genericLinkIt)
      .toBe(`/it/overview-page-it-${time}/d1-it-${time}`);

    await expect(projectLinkIt)
      .toBe(`/it/overview-page-it-${time}/project-it-${time}`);

    await expect(eventLinkIt)
      .toBe(`/it/overview-page-it-${time}/event-it-${time}`);

    await expect(newsLinkIt)
      .toBe(`/it/overview-page-it-${time}/news-it-${time}`);

    await expect(magazineLinkIt)
      .toBe(`/it/overview-page-it-${time}/magazine-it-${time}`);

    // #########################################
    // cleanup
    // #########################################
    await payload.delete({
      collection: 'projectDetailPage',
      id: projectPage.id,
    });

    await payload.delete({
      collection: 'magazineDetailPage',
      id: magazinePage.id,
    });

    await payload.delete({
      collection: 'eventDetailPage',
      id: eventPage.id,
    });

    await payload.delete({
      collection: 'newsDetailPage',
      id: newsPage.id,
    });
  });
});
