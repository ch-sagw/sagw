/**
 * Exhaustive test:
 * - add all possible blocks to home
 * - add links to different pages in all possible places (hero and blocks)
 * and test if they are rendered properly in the frontend
 * - add italian slugs to all linked pages and test links are properly rendered
 * in italian frontend page
 * - check if Links collection has all required references
 * - check link in status message
 */

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateOverviewPage,
} from '@/test-helpers/collections-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { getTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';

test.describe('Home links (sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    let homeId;
    let detail1;
    let detail4;
    let detail5;
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

      detail1 = await generateDetailPage({
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
      const statusMessage = await payload.find({
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
                  documentId: detail5.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('[test]status-message:link'),
              },
            },
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
                  iconName: 'homeTeaserFunding',
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
    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

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

    const dataPrivacyLink = await page.getByRole('link', {
      name: '[test]dataPrivacy:link',
    })
      .getAttribute('href');

    const impressumLink = await page.getByRole('link', {
      name: '[test]impressum:link',
    })
      .getAttribute('href');

    const statusMessageLink = await page.getByRole('link', {
      name: '[test]status-message:link',
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
    await expect(statusMessageLink)
      .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}`);

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

    const dataPrivacyLinkIt = await page.getByRole('link', {
      name: '[test]dataPrivacy:link',
    })
      .getAttribute('href');

    const impressumLinkIt = await page.getByRole('link', {
      name: '[test]impressum:link',
    })
      .getAttribute('href');

    const statusMessageLinkIt = await page.getByRole('link', {
      name: '[test]status-message:link',
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
    await expect(statusMessageLinkIt)
      .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}`);

    await expect(dataPrivacyLinkIt)
      .toBe('/it/data-privacy-it');
    await expect(impressumLinkIt)
      .toBe('/it/impressum-it');
  });
});
