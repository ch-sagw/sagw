import {
  expect, test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  generateTenant,
  getTenantId,
} from '@/test-helpers/tenant-generator';
import {
  generateDetailPage,
  generateEventDetailPage,
  generateMagazineDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
  generateRegularForm, getHomeId,
  regenerateAllGenericData,
} from '@/test-helpers/collections-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  rte4FullRange, sampleFootnoteContent,
  sampleRte1,
} from '@/utilities/rteSampleContent';
import { addPlaywrightErrorPage } from '@/seed/test-data/tenantDataPlaywright';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

// ########################################################################
// Helpers: Generate pages
// ########################################################################

/* eslint-disable no-await-in-loop */

const generateEventPages = async ({
  amount,
  home,
  tenant,
}: {
  amount: number;
  home: string;
  tenant: string;
}): Promise<void> => {
  const indices = Array.from({
    length: amount,
  }, (_, idx) => idx + 1);

  const payload = await getPayloadCached();
  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Category'),
      tenant,
    },
    locale: 'de',
  });

  for (const i of indices) {
    const day = String(i)
      .padStart(2, '0');

    await generateEventDetailPage({
      category: eventCategory.id,
      date: `2040-08-${day}T12:00:00.000Z`,
      locale: 'de',
      navigationTitle: `event ${i}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event ${i}`,
    });
  }
};

const generateNewsPages = async ({
  amount,
  home,
  tenant,
}: {
  amount: number;
  home: string;
  tenant: string;
}): Promise<void> => {
  const indices = Array.from({
    length: amount,
  }, (_, idx) => idx + 1);

  for (const i of indices) {
    const day = String(i)
      .padStart(2, '0');

    await generateNewsDetailPage({
      date: `2031-08-${day}T12:00:00.000Z`,
      navigationTitle: `news ${day}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `news ${day}`,
    });
  }
};

const generateProjectPages = async ({
  amount,
  home,
  tenant,
}: {
  amount: number;
  home: string;
  tenant: string;
}): Promise<void> => {
  const indices = Array.from({
    length: amount,
  }, (_, idx) => idx + 1);

  for (const i of indices) {
    await generateProjectDetailPage({
      locale: 'de',
      navigationTitle: `project ${i}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `project ${i}`,
    });
  }
};

const generateMagazinePages = async ({
  amount,
  home,
  tenant,
}: {
  amount: number;
  home: string;
  tenant: string;
}): Promise<void> => {
  const indices = Array.from({
    length: amount,
  }, (_, idx) => idx + 1);

  for (const i of indices) {
    const day = String(i)
      .padStart(2, '0');

    await generateMagazineDetailPage({
      date: `2031-08-${day}T12:00:00.000Z`,
      locale: 'de',
      navigationTitle: `magazine ${day}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `magazine ${day}`,
    });
  }
};

const generatePublicationPages = async ({
  amount,
  home,
  tenant,
}: {
  amount: number;
  home: string;
  tenant: string;
}): Promise<void> => {
  const indices = Array.from({
    length: amount,
  }, (_, idx) => idx + 1);

  for (const i of indices) {
    await generatePublicationDetailPage({
      locale: 'de',
      navigationTitle: `publication${i}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `publication${i}`,
    });
  }
};

const generateSamplePagesForTeasers = async ({
  amount,
  home,
  tenant,
}: {
  amount: number;
  home: string;
  tenant: string;
}): Promise<void> => {
  await generateEventPages({
    amount,
    home,
    tenant,
  });

  await generateNewsPages({
    amount,
    home,
    tenant,
  });

  await generateProjectPages({
    amount,
    home,
    tenant,
  });

  await generateMagazinePages({
    amount,
    home,
    tenant,
  });

  await generatePublicationPages({
    amount,
    home,
    tenant,
  });
};

/* eslint-enable no-await-in-loop */

// ########################################################################
// Helpers: Setup test pages
// ########################################################################

const setupSagwHomePage = async (): Promise<void> => {
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

  const detailPage = await generateDetailPage({
    navigationTitle: 'nav title',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: 'Detail Page',
  });

  await generateSamplePagesForTeasers({
    amount: 5,
    home,
    tenant,
  });

  // create a form
  const sampleForm = await generateRegularForm(tenant);

  // add content
  await payload.update({
    collection: 'homePage',
    data: {
      content: [

        // home teasers
        {
          blockType: 'homeTeasersBlock',
          homeTeasers: [
            {
              category: 'Förderung',
              iconName: 'homeTeaserFunding',
              link: {
                internalLink: {
                  documentId: detailPage.id,
                  slug: 'someslug',
                },
                linkText: simpleRteConfig('Zur Förderung'),
              },
              text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
              title: simpleRteConfig('Wir schaffen verlässliche Grundlagen für geistes- und sozialwissenschaftliche Forschung in der Schweiz.'),
            },

            {
              category: 'Netzwerk',
              iconName: 'homeTeaserNetwork',
              link: {
                internalLink: {
                  documentId: detailPage.id,
                  slug: 'someslug',
                },
                linkText: simpleRteConfig('Zum Netzwerkl'),
              },
              text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
              title: simpleRteConfig('Wir verbinden Disziplinen, Menschen und Institutionen in einem einzigartigen wissenschaftlichen Netzwerk.'),
            },

            {
              category: 'Aktivitäten',
              iconName: 'homeTeaserActivities',
              link: {
                internalLink: {
                  documentId: detailPage.id,
                  slug: 'someslug',
                },
                linkText: simpleRteConfig('Zu den Aktivitäten'),
              },
              text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
              title: simpleRteConfig('Wir initiieren Debatten und vermittelt Wissen zwischen Wissenschaft, Gesellschaft und Politik.'),
            },
          ],
        },

        // form
        {
          blockType: 'formBlock',
          form: sampleForm,
        },

        // richtext
        {
          blockType: 'textBlock',
          text: rte4FullRange,
        },

        // event teasers
        {
          blockType: 'eventsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Event Teasers'),
        },

        // magazine teasers
        {
          alignment: 'horizontal',
          blockType: 'magazineTeasersBlock',
          lead: simpleRteConfig('Some Lead Text'),
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Magazine Teasers'),
        },

        // news teasers
        {
          blockType: 'newsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('News Teasers'),
        },

        // publication teasers
        {
          blockType: 'publicationsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Publication Teasers'),
        },

        // project teasers
        {
          alignment: 'vertical',
          blockType: 'projectsTeasersBlock',
          lead: simpleRteConfig('Some Lead Text'),
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Projects Teasers'),
        },
      ],

      // hero
      hero: {
        animated: true,
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        optionalLink: {
          includeLink: true,
          link: {
            internalLink: {
              documentId: detailPage.id,
              slug: 'detailPage',
            },
            linkText: simpleRteConfig('Mehr über uns erfahren'),
          },
        },
        sideTitle: simpleRteConfig('Akademie der Geistes- und Sozial­wissenschaften'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: home,
  });
};

const setupSagwHomePageNonSagw = async (overrideTime?: number): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();
  const time = overrideTime ?? (new Date())
    .getTime();

  const tenant = await generateTenant({
    name: `tenant-${time}`,
  });

  const home = await getHomeId({
    isSagw: false,
    tenant: tenant.id,
  });

  const detailPage = await generateDetailPage({
    navigationTitle: 'nav title',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant: tenant.id,
    title: 'Detail Page',
  });

  await generateSamplePagesForTeasers({
    amount: 5,
    home,
    tenant: tenant.id,
  });

  // create a form
  const sampleForm = await generateRegularForm(tenant.id);

  // add content
  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        // form
        {
          blockType: 'formBlock',
          form: sampleForm,
        },

        // richtext
        {
          blockType: 'textBlock',
          text: rte4FullRange,
        },

        // event teasers
        {
          blockType: 'eventsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Event Teasers'),
        },

        // magazine teasers
        {
          alignment: 'horizontal',
          blockType: 'magazineTeasersBlock',
          lead: simpleRteConfig('Some Lead Text'),
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Magazine Teasers'),
        },

        // news teasers
        {
          blockType: 'newsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('News Teasers'),
        },

        // publication teasers
        {
          blockType: 'publicationsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Publication Teasers'),
        },

        // project teasers
        {
          alignment: 'vertical',
          blockType: 'projectsTeasersBlock',
          lead: simpleRteConfig('Some Lead Text'),
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Projects Teasers'),
        },
      ],

      // hero
      hero: {
        animated: true,
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        optionalLink: {
          includeLink: true,
          link: {
            internalLink: {
              documentId: detailPage.id,
              slug: 'detailPage',
            },
            linkText: simpleRteConfig('Mehr über uns erfahren'),
          },
        },
        sideTitle: simpleRteConfig('Akademie der Geistes- und Sozial­wissenschaften'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: home,
  });
};

const setupDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const detailPage = await generateDetailPage({
    navigationTitle: 'nav title',
    parentPage: {
      documentId: homeId,
      slug: 'homePage',
    },
    tenant: tenantId,
    title: 'Detail Page',
  });

  const detailPageForLinks = await generateDetailPage({
    navigationTitle: 'nav title 2',
    parentPage: {
      documentId: homeId,
      slug: 'homePage',
    },
    tenant: tenantId,
    title: 'Detail Page 2',
  });

  // create a form
  const sampleForm = await generateRegularForm(tenantId);

  // create document
  const document = await payload.create({
    collection: 'documents',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      date: '2025-10-30',
      tenant: tenantId,
      title: simpleRteConfig('Some Document'),
    },
    filePath: 'src/seed/test-data/assets/sagw.pdf',
  });

  // add zenodo document
  const zenodoDocument = await payload.create({
    collection: 'zenodoDocuments',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      files: [
        {
          format: 'pdf',
          id: 'someid',
          link: 'https://foo.bar',
          size: 0.26,
        },
        {
          format: 'zip',
          id: 'someotherid',
          link: 'https://foo.bar',
          size: 1.54,
        },
      ],
      publicationDate: '1919-05-01',
      tenant: tenantId,
      title: 'Sample Zenodo Document',
      zenodoId: '1512691',
    },
  });

  // add image
  const image = await payload.create({
    collection: 'images',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      alt: 'alt',
      tenant: tenantId,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  // add video
  const video = await payload.create({
    collection: 'videos',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      tenant: tenantId,
      title: 'video',
    },
    filePath: 'src/seed/test-data/assets/sagw.mp4',
  });

  // add person
  const person = await payload.create({
    collection: 'people',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image: image.id,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant: tenantId,
    },
  });

  // add content
  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        // form
        {
          blockType: 'formBlock',
          form: sampleForm,
        },

        // richtext
        {
          blockType: 'textBlock',
          text: sampleRte1,
        },

        // links
        {
          blockType: 'linksBlock',
          links: [
            {
              linkExternal: {
                description: simpleRteConfig('Offenes Repository für EU-finanzierte Forschungsergebnisse aus Horizon Europe, Euratom und früheren Rahmenprogrammen.'),
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Artikel auf Zenodo'),
              },
              linkType: 'external',
            },
            {
              linkInternal: {
                internalLink: {
                  documentId: detailPageForLinks.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('Artikel auf Zenodo'),
              },
              linkType: 'internal',
            },
            {
              linkMail: {
                email: 'foo@bar.com',
                linkText: simpleRteConfig('Schreiben Sie eine E-Mail'),
              },
              linkType: 'mail',
            },
          ],
        },

        // downloads
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'documents',
              value: document.id,
            },
            {
              relationTo: 'zenodoDocuments',
              value: zenodoDocument.id,
            },
          ],
          subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
        },

        // image
        {
          alignment: 'center',
          blockType: 'imageBlock',
          caption: simpleRteConfig('Some caption'),
          credits: simpleRteConfig('Some credits'),
          image: image.id,
        },

        // video
        {
          'alignment': 'center',
          'blockType': 'videoBlock',
          'caption': simpleRteConfig('Some caption'),
          'credits': simpleRteConfig('Some credits'),
          'stillImage': image.id,
          'video-de': video.id,
          'video-en': video.id,
          'video-fr': video.id,
          'video-it': video.id,
        },

        // accordion
        {
          accordions: [
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 1'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 2'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 3'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 4'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 5'),
            },
          ],
          blockType: 'accordionBlock',
          colorMode: 'white',
          title: simpleRteConfig('Accordion title'),
        },

        // personal contact
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },

        // cta link block internal link
        {
          blockType: 'ctaLinkBlock',
          linkInternal: {
            internalLink: {
              documentId: detailPage.id,
              slug: 'detailPage',
            },
            linkText: simpleRteConfig('Internal Link Text (internal)'),
          },
          linkType: 'internal',
          text: simpleRteConfig('CTA Link Block Text (internal)'),
          title: simpleRteConfig('CTA Link Block Title (internal)'),

        },

        // cta link block external link
        {
          blockType: 'ctaLinkBlock',
          linkExternal: {
            externalLink: 'https://www.foo.bar',
            externalLinkText: simpleRteConfig('External Link Text (external)'),
          },
          linkType: 'external',
          text: simpleRteConfig('CTA Link Block Text (external)'),
          title: simpleRteConfig('CTA Link Block Title (external)'),

        },

        // cta link block mail link
        {
          blockType: 'ctaLinkBlock',
          linkMail: {
            email: 'foo@bar.com',
            linkText: simpleRteConfig('Mail link'),
          },
          linkType: 'mail',
          text: simpleRteConfig('CTA Link Block Text (mail)'),
          title: simpleRteConfig('CTA Link Block Title (mail)'),

        },

        // generic teaser
        {
          alignment: 'horizontal',
          blockType: 'genericTeasersBlock',
          lead: simpleRteConfig('Lead'),
          teasers: [
            {
              image: {
                relationTo: 'images',
                value: image.id,
              },
              linkExternal: {
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Link'),
              },
              linkType: 'external',
              text: simpleRteConfig('Generic Teaser text'),
              title: simpleRteConfig('Generic Teaser 1'),
            },
            {
              image: {
                relationTo: 'images',
                value: image.id,
              },
              linkExternal: {
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Link'),
              },
              linkType: 'external',
              text: simpleRteConfig('Generic Teaser text'),
              title: simpleRteConfig('Generic Teaser 2'),
            },
          ],
          title: simpleRteConfig('Generic Teaser'),
        },

        // notification
        {
          blockType: 'notificationBlock',
          text: simpleRteConfig('Sample notification text.'),
        },

        // small text
        {
          blockType: 'footnoteBlock',
          text: sampleFootnoteContent,
          title: simpleRteConfig('Footnote'),
        },
      ],

      // hero
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: detailPage.id,
  });
};

const setupOverviewWithTeasersPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const overviewPage = await generateOverviewPage({
    navigationTitle: 'nav title',
    parentPage: {
      documentId: homeId,
      slug: 'homePage',
    },
    tenant: tenantId,
    title: 'Overview Page',
  });

  await generateSamplePagesForTeasers({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // create a form
  const sampleForm = await generateRegularForm(tenantId);

  // add image
  const image = await payload.create({
    collection: 'images',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      alt: 'alt',
      tenant: tenantId,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  // add person
  const person = await payload.create({
    collection: 'people',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image: image.id,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant: tenantId,
    },
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        // form
        {
          blockType: 'formBlock',
          form: sampleForm,
        },

        // richtext
        {
          blockType: 'textBlock',
          text: sampleRte1,
        },

        // accordion
        {
          accordions: [
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 1'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 2'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 3'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 4'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 5'),
            },
          ],
          blockType: 'accordionBlock',
          colorMode: 'white',
          title: simpleRteConfig('Accordion title'),
        },

        // personal contact
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },

        // generic teaser
        {
          alignment: 'horizontal',
          blockType: 'genericTeasersBlock',
          lead: simpleRteConfig('Lead'),
          teasers: [
            {
              image: {
                relationTo: 'images',
                value: image.id,
              },
              linkExternal: {
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Link'),
              },
              linkType: 'external',
              text: simpleRteConfig('Generic Teaser text'),
              title: simpleRteConfig('Generic Teaser 1'),
            },
            {
              image: {
                relationTo: 'images',
                value: image.id,
              },
              linkExternal: {
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Link'),
              },
              linkType: 'external',
              text: simpleRteConfig('Generic Teaser text'),
              title: simpleRteConfig('Generic Teaser 2'),
            },
          ],
          title: simpleRteConfig('Generic Teaser'),
        },

        // notification
        {
          blockType: 'notificationBlock',
          text: simpleRteConfig('Sample notification text.'),
        },

        // event teasers
        {
          blockType: 'eventsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: overviewPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Event Teasers'),
        },

        // magazine teasers
        {
          alignment: 'horizontal',
          blockType: 'magazineTeasersBlock',
          lead: simpleRteConfig('Some Lead Text'),
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: overviewPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Magazine Teasers'),
        },

        // news teasers
        {
          blockType: 'newsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: overviewPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('News Teasers'),
        },

        // publication teasers
        {
          blockType: 'publicationsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: overviewPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Publication Teasers'),
        },

        // project teasers
        {
          alignment: 'vertical',
          blockType: 'projectsTeasersBlock',
          lead: simpleRteConfig('Some Lead Text'),
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: overviewPage.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Projects Teasers'),
        },
      ],

      // hero
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

// ########################################################################
// Tests
// ########################################################################

test.describe('home', () => {
  beforeEachAcceptCookies();

  test('sagw', async ({
    page,
  }) => {
    await regenerateAllGenericData();

    await setupSagwHomePage();

    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('non-sagw', async ({
    page,
  }) => {
    const time = (new Date())
      .getTime();

    await setupSagwHomePageNonSagw(time);

    await page.goto(`http://localhost:3000/de/tenant-${time}`);
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });
});

test.describe('detail page', () => {
  beforeEachAcceptCookies();

  test('sagw', async ({
    page,
  }) => {
    await regenerateAllGenericData();

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

    await setupDetailPage({
      homeId: home,
      tenantId: tenant || '',
    });

    await page.goto('http://localhost:3000/de/detail-page');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('non-sagw', async ({
    page,
  }) => {
    const time = (new Date())
      .getTime();

    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupDetailPage({
      homeId: home,
      tenantId: tenant.id,
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/detail-page`);
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });
});

test.describe('overview page with teasers', () => {
  beforeEachAcceptCookies();

  test('sagw', async ({
    page,
  }) => {
    await regenerateAllGenericData();

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

    await setupOverviewWithTeasersPage({
      homeId: home,
      tenantId: tenant || '',
    });

    await page.goto('http://localhost:3000/de/overview-page');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('non-sagw', async ({
    page,
  }) => {
    const time = (new Date())
      .getTime();

    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithTeasersPage({
      homeId: home,
      tenantId: tenant.id,
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/overview-page`);
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });

  });
});

test.describe('impressum page', () => {
  beforeEachAcceptCookies();

  test('sagw', async ({
    page,
  }) => {
    await regenerateAllGenericData();

    await page.goto('http://localhost:3000/de/impressum-de');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('non-sagw', async ({
    page,
  }) => {
    const time = (new Date())
      .getTime();

    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });

    await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/impressum-de`);
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });
});

test.describe('data privacy page', () => {
  beforeEachAcceptCookies();

  test('sagw', async ({
    page,
  }) => {
    await regenerateAllGenericData();

    await page.goto('http://localhost:3000/de/data-privacy-de');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('non-sagw', async ({
    page,
  }) => {

    const time = (new Date())
      .getTime();

    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });

    await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/data-privacy-de`);
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });
});

test.describe('error page', () => {
  beforeEachAcceptCookies();

  test('sagw', async ({
    page,
  }) => {
    await regenerateAllGenericData();

    await page.goto('http://localhost:3000/de/some-random-page-that-does-not-exist');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('non-sagw', async ({
    page,
  }) => {
    const time = (new Date())
      .getTime();

    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });

    await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    const payload = await getPayloadCached();

    await addPlaywrightErrorPage({
      payload,
      tenant: tenant.id,
      tenantName: 'non-sagw',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/some-random-page-that-does-not-exist`);
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });
});
