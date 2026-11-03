/**
 * Fathom event tracking (stubbed Fathom script, no credentials needed).
 * The real Fathom API is only exercised by `tracking.be.spec.ts`.
 */

import {
  expect,
  type Page,
  test,
} from '@playwright/test';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  getTenant, getTenantNonSagw,
} from '@/test-helpers/tenant-generator';
import {
  generateDetailPage,
  generateDocument,
  generateEventDetailPage,
  generateImage,
  generateInstituteDetailPage,
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
  generateOverviewPage,
  generateRegularForm,
  generateVideo,
  generateZenodoDocument,
} from '@/test-helpers/collections-generator';
import {
  expectTrackedEvents,
  getLoadedSiteIds,
  getPageviewCount,
  getSetSiteIds,
  getTrackedEventNames,
  getTrackedEvents,
  setupTrackingPage,
  waitForFathomStub,
} from '@/test-helpers/fathom-stub';
import {
  buildTrackingEventName,
  TRACKING_EVENTS,
} from '@/components/helpers/tracking.constants';
import { resolveFathomSiteId } from '@/tracking/fathomSites';
import { deleteUser } from '@/mail/helpers';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import type { InterfaceLinksBlock } from '@/payload-types';

const baseUrl = 'http://localhost:3000';
const daysFromNow = (days: number): string => {
  const date = new Date();

  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);

  return date.toISOString();
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const gotoAndWaitForStub = async (page: Page, url: string): Promise<void> => {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await waitForFathomStub(page);
};

const getSagwHomeId = async (tenant: string): Promise<string> => {
  const payload = await getPayloadCached();
  const home = await payload.find({
    collection: 'homePage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  return home.docs[0].id;
};

const pollSetSiteIds = (page: Page): ReturnType<typeof expect.poll<string[]>> => expect.poll(() => getSetSiteIds(page));
const pollPageviewCount = (page: Page): ReturnType<typeof expect.poll<number>> => expect.poll(() => getPageviewCount(page));
const getTrackedSiteIds = async (page: Page): Promise<(string | undefined)[]> => (await getTrackedEvents(page)).map((event) => event.siteId);
const expectNoEvents = async (page: Page): Promise<void> => {
  // give a potential (wrong) event time to arrive
  await sleep(1500);

  expect(await getTrackedEventNames(page))
    .toEqual([]);
};

test.describe.configure({
  mode: 'serial',
});

test.describe('Tracking events', () => {
  let tenant = '';
  let homeId = '';
  let time = 0;
  let expectedSiteId: string | undefined;

  test.beforeAll(async () => {
    tenant = (await getTenant()) || '';
    homeId = await getSagwHomeId(tenant);
    time = Date.now();
    expectedSiteId = resolveFathomSiteId({
      tenantSlug: 'sagw',
    });

    expect(expectedSiteId, 'NEXT_PUBLIC_TRACKING_SITE_ID must be set in .env.playwright')
      .toBeTruthy();
  });

  test.beforeEach(async ({
    page,
  }) => {
    await setupTrackingPage(page);
  });

  // ---------------------------------------------------------------------
  // per-tenant site id
  // ---------------------------------------------------------------------

  test.describe('Per-tenant site id', () => {
    test('sagw pages load and set the sagw site id and track a pageview', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      await gotoAndWaitForStub(page, `${baseUrl}/de`);

      expect(await getLoadedSiteIds(page))
        .toEqual([expectedSiteId]);

      await pollSetSiteIds(page)
        .toEqual([expectedSiteId]);

      await pollPageviewCount(page)
        .toBeGreaterThanOrEqual(1);
    });

    test('non-sagw tenant pages use the tenant site id', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      await getTenantNonSagw();

      const nonSagwSiteId = resolveFathomSiteId({
        tenantSlug: 'not-sagw',
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/not-sagw`);

      expect(await getLoadedSiteIds(page))
        .toEqual([nonSagwSiteId]);

      await pollSetSiteIds(page)
        .toEqual([nonSagwSiteId]);

      if (process.env.ENV === 'playwright') {
        // the playwright map gives not-sagw its own (fake) site id
        expect(nonSagwSiteId)
          .not.toBe(expectedSiteId);
      }
    });

    test('does not load the script before consent and after declining analytics', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      await setupTrackingPage(page, {
        consentGiven: false,
      });
      await page.goto(`${baseUrl}/de`);
      await page.waitForLoadState('networkidle');
      await sleep(1500);

      expect(await getLoadedSiteIds(page))
        .toEqual([]);

      await setupTrackingPage(page, {
        analytics: false,
      });
      await page.goto(`${baseUrl}/de`);
      await page.waitForLoadState('networkidle');
      await sleep(1500);

      expect(await getLoadedSiteIds(page))
        .toEqual([]);
    });
  });

  // ---------------------------------------------------------------------
  // network items
  // ---------------------------------------------------------------------

  test.describe('Network items', () => {
    test('tracks the click on a network item', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const payload = await getPayloadCached();
      const image = await generateImage(tenant);
      const category = await payload.create({
        collection: 'networkCategories',
        data: {
          name: simpleRteConfig(`Tracking category ${time}`),
          tenant,
        },
      });
      const itemTitle = `Tracking network item ${time}`;

      await generateOverviewPage({
        content: [
          {
            blockType: 'networkTeasersBlock',
            filter: {
              allCheckboxText: simpleRteConfig('Alle'),
              title: simpleRteConfig('Filter'),
            },
            items: {
              foundingYearText: simpleRteConfig('Gründungsjahr'),
              items: [
                {
                  category: category.id,
                  externalLink: 'https://www.foo.bar',
                  foundingYear: 1983,
                  image,
                  title: simpleRteConfig(itemTitle),
                },
              ],
              linkText: simpleRteConfig('Öffnen'),
            },
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking network ${time}`,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-network-${time}`);

      await page.getByTestId('genericTeaserItemTitle')
        .filter({
          hasText: itemTitle,
        })
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.networkLink,
        buildTrackingEventName(TRACKING_EVENTS.networkLink, itemTitle),
      ]);

      expect(await getTrackedSiteIds(page))
        .toEqual([
          expectedSiteId,
          expectedSiteId,
        ]);
    });
  });

  // ---------------------------------------------------------------------
  // editions
  // ---------------------------------------------------------------------

  test.describe('Editions', () => {
    test('tracks the click on an edition item', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const itemTitle = `Tracking edition ${time}`;

      await generateOverviewPage({
        content: [
          {
            blockType: 'editionsOverview',
            items: {
              items: [
                {
                  externalLink: 'https://www.foo.bar',
                  text: simpleRteConfig('Edition text'),
                  title: simpleRteConfig(itemTitle),
                },
              ],
              linkText: simpleRteConfig('Öffnen'),
            },
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking editions ${time}`,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-editions-${time}`);

      await page.getByTestId('genericTeaserItemTitle')
        .filter({
          hasText: itemTitle,
        })
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.editionLink,
        buildTrackingEventName(TRACKING_EVENTS.editionLink, itemTitle),
      ]);
    });
  });

  // ---------------------------------------------------------------------
  // links block on national dictionary / institute pages
  // ---------------------------------------------------------------------

  const linksBlockContent = (externalText: string, internalDocumentId: string): InterfaceLinksBlock[] => [
    {
      blockType: 'linksBlock',
      links: [
        {
          linkExternal: {
            description: simpleRteConfig('External description'),
            externalLink: 'https://www.foo.bar',
            externalLinkText: simpleRteConfig(externalText),
          },
          linkType: 'external',
        },
        {
          linkInternal: {
            internalLink: {
              documentId: internalDocumentId,
              slug: 'homePage',
            },
            linkText: simpleRteConfig('Internal link'),
          },
          linkType: 'internal',
        },
      ],
    },
  ];

  test.describe('National dictionaries', () => {
    test('tracks external links in the links block of a national dictionary page', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const payload = await getPayloadCached();
      const linkText = `Dictionary external link ${time}`;
      const dictionary = await generateNationalDictionaryDetailPage({
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking dictionary ${time}`,
      });

      await payload.update({
        collection: 'nationalDictionaryDetailPage',
        data: {
          content: linksBlockContent(linkText, homeId),
        },
        id: dictionary.id,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-dictionary-${time}`);

      await page.getByTestId('downloadLinkItem')
        .filter({
          hasText: linkText,
        })
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.nationalDictionaryLink,
        buildTrackingEventName(TRACKING_EVENTS.nationalDictionaryLink, linkText),
      ]);
    });
  });

  test.describe('Institutes', () => {
    test('tracks external links in the links block of an institute page, not internal ones', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const payload = await getPayloadCached();
      const linkText = `Institute external link ${time}`;
      const institute = await generateInstituteDetailPage({
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking institute ${time}`,
      });

      await payload.update({
        collection: 'instituteDetailPage',
        data: {
          content: linksBlockContent(linkText, homeId),
        },
        id: institute.id,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-institute-${time}`);

      // internal link: nothing
      await page.getByTestId('downloadLinkItem')
        .filter({
          hasText: 'Internal link',
        })
        .click();

      await expectNoEvents(page);

      // external link: tracked
      await page.getByTestId('downloadLinkItem')
        .filter({
          hasText: linkText,
        })
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.instituteLink,
        buildTrackingEventName(TRACKING_EVENTS.instituteLink, linkText),
      ]);
    });

    test('does not track links blocks on other page types', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const linkText = `Detail external link ${time}`;

      await generateDetailPage({
        content: linksBlockContent(linkText, homeId),
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking detail links ${time}`,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-detail-links-${time}`);

      await page.getByTestId('downloadLinkItem')
        .filter({
          hasText: linkText,
        })
        .click();

      await expectNoEvents(page);
    });
  });

  // ---------------------------------------------------------------------
  // external events
  // ---------------------------------------------------------------------

  test.describe('External events', () => {
    test('tracks events linking to an external page in overview and teaser, not events with detail page', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const payload = await getPayloadCached();
      const project = await payload.create({
        collection: 'projects',
        data: {
          name: simpleRteConfig(`Tracking project ${time}`),
          tenant,
        },
        locale: 'de',
      });
      const externalTitle = `Tracking external event ${time}`;
      const internalTitle = `Tracking internal event ${time}`;

      // nearest upcoming events, so they appear in the (limited) teaser too
      const externalEvent = await generateEventDetailPage({
        date: daysFromNow(1),
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        project: project.id,
        tenant,
        title: externalTitle,
      });

      await payload.update({
        collection: 'eventDetailPage',
        data: {
          link: {
            externalLink: 'https://www.foo.bar',
          },
          showDetailPage: 'false',
        },
        id: externalEvent.id,
      });

      await generateEventDetailPage({
        date: daysFromNow(2),
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        project: project.id,
        tenant,
        title: internalTitle,
      });

      // events overview
      await generateOverviewPage({
        content: [
          {
            blockType: 'eventsOverviewBlock',
            title: simpleRteConfig('Events'),
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking events ${time}`,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-events-${time}`);

      await page.getByTestId('eventListItem')
        .filter({
          hasText: internalTitle,
        })
        .click();

      await expectNoEvents(page);

      await page.getByTestId('eventListItem')
        .filter({
          hasText: externalTitle,
        })
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.externalEventLink,
        buildTrackingEventName(TRACKING_EVENTS.externalEventLink, externalTitle),
      ]);

      // events teaser
      await generateOverviewPage({
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking events teaser ${time}`,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-events-teaser-${time}`);

      await page.getByTestId('eventListItem')
        .filter({
          hasText: externalTitle,
        })
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.externalEventLink,
        buildTrackingEventName(TRACKING_EVENTS.externalEventLink, externalTitle),
      ]);
    });
  });

  // ---------------------------------------------------------------------
  // export magazine article
  // ---------------------------------------------------------------------

  test.describe('Magazine article export', () => {
    test('tracks the click on the export button', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const payload = await getPayloadCached();
      const articleTitle = `Tracking magazine ${time}`;

      await generateMagazineDetailPage({
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: articleTitle,
      });

      const i18n = await payload.find({
        collection: 'i18nGlobals',
        limit: 1,
        locale: 'de',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });
      const exportText = rte1ToPlaintext(i18n.docs[0].generic.exportArticleButtonText);

      // no PDF generation in this test
      await page.route('**/api/magazine-pdf/**', async (route) => {
        await route.fulfill({
          body: 'disabled in test',
          status: 500,
        });
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-magazine-${time}`);

      // large and small export button exist, only one is visible per viewport
      await page.getByRole('button', {
        name: exportText,
      })
        .locator('visible=true')
        .first()
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.magazineArticleExport,
        buildTrackingEventName(TRACKING_EVENTS.magazineArticleExport, articleTitle),
      ]);
    });
  });

  // ---------------------------------------------------------------------
  // downloads
  // ---------------------------------------------------------------------

  test.describe('Downloads', () => {
    test('tracks total and per-document downloads for documents and zenodo files', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const documentTitle = `Tracking document ${time}`;
      const zenodoTitle = `Tracking zenodo ${time}`;
      const document = await generateDocument(tenant, undefined, documentTitle);
      const zenodo = await generateZenodoDocument(tenant, undefined, zenodoTitle);

      await generateDetailPage({
        content: [
          {
            blockType: 'downloadsBlock',
            customOrAuto: 'custom',
            downloads: [
              {
                relationTo: 'documents',
                value: document,
              },
              {
                relationTo: 'zenodoDocuments',
                value: zenodo,
              },
            ],
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking downloads ${time}`,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-downloads-${time}`);

      const items = page.getByTestId('downloadLinkItem');

      await items.filter({
        hasText: documentTitle,
      })
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.download,
        buildTrackingEventName(TRACKING_EVENTS.download, documentTitle),
      ]);

      // zenodo documents with several files get a " - 1 / 2" suffix
      const zenodoItemTitle = `${zenodoTitle} - 1 / 2`;

      await items.filter({
        hasText: zenodoItemTitle,
      })
        .click();

      await expectTrackedEvents(page, [buildTrackingEventName(TRACKING_EVENTS.download, zenodoItemTitle)]);

      const names = await getTrackedEventNames(page);

      expect(names.filter((name) => name === TRACKING_EVENTS.download))
        .toHaveLength(2);
    });
  });

  // ---------------------------------------------------------------------
  // forms
  // ---------------------------------------------------------------------

  test.describe('Form submissions', () => {
    test('tracks a successful custom form submission exactly once', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const formId = await generateRegularForm(tenant);

      await generateDetailPage({
        content: [
          {
            blockType: 'formBlock',
            form: formId,
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking form ${time}`,
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-form-${time}`);

      const form = page.locator('form')
        .first();

      // nothing before submitting
      await expectNoEvents(page);

      await form.getByLabel('Nachname')
        .fill('Nachname');
      await form.getByLabel('Vorname')
        .fill('Vorname');
      await form.getByLabel('Kommentar')
        .fill('Kommentar');
      await form.getByText('Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.')
        .click();
      await form.getByText('Deutsch')
        .click();
      await form.locator('button')
        .click();

      await expect(page.getByText('Submit title success', {
        exact: true,
      }))
        .toBeVisible();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.formSubmission,
        buildTrackingEventName(TRACKING_EVENTS.formSubmission, 'Contact Form'),
      ]);

      // resending from the success notification must not count again
      await sleep(1500);

      const names = await getTrackedEventNames(page);

      expect(names.filter((name) => name === TRACKING_EVENTS.formSubmission))
        .toHaveLength(1);
    });

    test('tracks a successful newsletter form submission with its own title', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const payload = await getPayloadCached();
      const email = `tracking-${time}@foo.bar`;
      const formTitle = `Tracking newsletter ${time}`;

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

            // must match list id's in brevo
            newsletterListIdDe: 12,
            newsletterListIdFr: 17,
            newsletterTemporaryListIdDe: 11,
            newsletterTemporaryListIdFr: 16,
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
          tenant,
          title: simpleRteConfig(formTitle),
        },
      });

      await generateDetailPage({
        content: [
          {
            blockType: 'formBlock',
            form: newsletterForm.id,
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking newsletter ${time}`,
      });

      try {
        await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-newsletter-${time}`);

        const form = page.locator('form')
          .first();

        await form.getByText('Deutsch')
          .click();
        await form.getByLabel('e-mail')
          .fill(email);
        await form.getByLabel('Vorname')
          .fill('Vorname');
        await form.getByLabel('Nachname')
          .fill('Nachname');
        await form.locator('input[type="checkbox"]')
          .click({
            force: true,
          });
        await form.locator('button')
          .click();

        await expect(page.getByText('Newsletter Submit title success', {
          exact: true,
        }))
          .toBeVisible();

        await expectTrackedEvents(page, [
          TRACKING_EVENTS.formSubmission,
          buildTrackingEventName(TRACKING_EVENTS.formSubmission, formTitle),
        ]);
      } finally {
        await deleteUser({
          email,
        });
      }
    });
  });

  // ---------------------------------------------------------------------
  // video views
  // ---------------------------------------------------------------------

  test.describe('Video views', () => {
    test('tracks one view when the video is started', {
      tag: '@tracking',
    }, async ({
      page,
    }) => {
      const videoId = await generateVideo(tenant);
      const image = await generateImage(tenant);

      await generateDetailPage({
        content: [
          {
            'alignment': 'center',
            'blockType': 'videoBlock',
            'caption': simpleRteConfig('Caption'),
            'credits': simpleRteConfig('Credits'),
            'stillImage': image,
            'video-de': videoId,
          },
        ],
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant,
        title: `tracking video ${time}`,
      });

      // the player iframe is not needed for the test
      await page.route('**/*.gumlet.io/**', async (route) => {
        await route.abort();
      });

      await gotoAndWaitForStub(page, `${baseUrl}/de/tracking-video-${time}`);

      await expectNoEvents(page);

      await page.locator('figure button')
        .first()
        .click();

      await expectTrackedEvents(page, [
        TRACKING_EVENTS.videoView,
        buildTrackingEventName(TRACKING_EVENTS.videoView, 'video'),
      ]);

      // a second click does not count again
      await page.locator('figure button')
        .first()
        .click({
          force: true,
        });
      await sleep(1000);

      const names = await getTrackedEventNames(page);

      expect(names.filter((name) => name === TRACKING_EVENTS.videoView))
        .toHaveLength(1);
    });
  });
});
