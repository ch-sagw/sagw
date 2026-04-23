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
  generateInstituteDetailPage,
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
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
import { BasePayload } from 'payload';

// ########################################################################
// Helpers: Generate pages
// ########################################################################

/* eslint-disable no-await-in-loop */

const generateEventPages = async ({
  amount,
  home,
  tenant,
  project,
}: {
  amount: number;
  home: string;
  tenant: string;
  project?: string;
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
      project,
      tenant,
      title: `event ${i}`,
    });
  }
};

const generateNewsPages = async ({
  amount,
  home,
  project,
  tenant,
}: {
  amount: number;
  home: string;
  tenant: string;
  project?: string;
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
      project,
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
  project,
}: {
  amount: number;
  home: string;
  tenant: string;
  project?: string;
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
      project,
      tenant,
      title: `publication${i}`,
    });
  }
};

const generateNationalDictionaryPages = async ({
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
    await generateNationalDictionaryDetailPage({
      locale: 'de',
      navigationTitle: `nationalDictionary ${i}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `nationalDictionary ${i}`,
    });
  }
};

const generateInstituePages = async ({
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
    await generateInstituteDetailPage({
      locale: 'de',
      navigationTitle: `institute ${i}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `institute ${i}`,
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
// Helpers: Other Collections
// ########################################################################
const generateTeam = async ({
  tenant,
}: {
  tenant: string
}): Promise<string> => {
  const payload = await getPayloadCached();
  const image = await payload.create({
    collection: 'images',
    data: {
      alt: 'image',
      tenant,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  const people = await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'people',
      data: {
        firstname: simpleRteConfig(`Firstname ${index}`),
        function: simpleRteConfig('Some function'),
        image: image.id,
        lastname: simpleRteConfig(`Lastname ${index}`),
        mail: 'foo@bar.com',
        phone: '031 123 45 67',
        tenant,
      },
    });
  }));

  // create a team
  const team = await payload.create({
    collection: 'teams',
    data: {
      name: simpleRteConfig('Team 1'),
      people: people.map((item) => item.id),
      tenant,
    },
  });

  return team.id;
};

const generateDocument = async ({
  payload,
  tenant,
}: {
  payload: BasePayload;
  tenant: string;
}): Promise<string> => {
  const document = await payload.create({
    collection: 'documents',
    data: {
      date: '2025-10-30',
      tenant,
      title: simpleRteConfig('Some Document'),
    },
    filePath: 'src/seed/test-data/assets/sagw.pdf',
  });

  return document.id;
};

const generateZenodoDocument = async ({
  payload,
  tenant,
}: {
  payload: BasePayload;
  tenant: string;
}): Promise<string> => {
  const zenodoDocument = await payload.create({
    collection: 'zenodoDocuments',
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
      tenant,
      title: 'Sample Zenodo Document',
      zenodoId: '1512691',
    },
  });

  return zenodoDocument.id;
};

const generateImage = async ({
  payload,
  tenant,
}: {
  payload: BasePayload;
  tenant: string;
}): Promise<string> => {
  const image = await payload.create({
    collection: 'images',
    data: {
      alt: 'alt',
      tenant,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  return image.id;
};

const generateVideo = async ({
  payload,
  tenant,
}: {
  payload: BasePayload;
  tenant: string;
}): Promise<string> => {
  const video = await payload.create({
    collection: 'videos',
    context: {
      skipGumletSync: true,
    },
    data: {
      duration: 24,
      tenant,
      title: 'video',
    },
    filePath: 'src/seed/test-data/assets/sagw.mp4',
  });

  return video.id;
};

const generatePerson = async ({
  payload,
  tenant,
  image,
}: {
  payload: BasePayload;
  tenant: string;
  image: string;
}): Promise<string> => {
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  return person.id;
};

const hideStatusMessage = async({
  tenant,
}: {
  tenant: string;
}): Promise<{
  initialShow: string;
  statusMessageId: string;
}> => {
  const payload = await getPayloadCached();
  const statusMessage = await payload.find({
    collection: 'statusMessage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const statusMessageShow = statusMessage.docs[0].content.show.display;

  await payload.update({
    collection: 'statusMessage',
    data: {
      content: {
        show: {
          display: 'hide',
        },
      },
    },
    id: statusMessage.docs[0].id,
  });

  return {
    initialShow: statusMessageShow,
    statusMessageId: statusMessage.docs[0].id,
  };
};

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
    slug: `tenant-${time}`,
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

  const sampleForm = await generateRegularForm(tenantId);

  const document = await generateDocument({
    payload,
    tenant: tenantId,
  });

  const zenodoDocument = await generateZenodoDocument({
    payload,
    tenant: tenantId,
  });

  const image = await generateImage({
    payload,
    tenant: tenantId,
  });

  const video = await generateVideo({
    payload,
    tenant: tenantId,
  });

  const person = await generatePerson({
    image,
    payload,
    tenant: tenantId,
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
              value: document,
            },
            {
              relationTo: 'zenodoDocuments',
              value: zenodoDocument,
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
          image,
        },

        // video
        {
          'alignment': 'center',
          'blockType': 'videoBlock',
          'caption': simpleRteConfig('Some caption'),
          'credits': simpleRteConfig('Some credits'),
          'stillImage': image,
          'video-de': video,
          'video-en': video,
          'video-fr': video,
          'video-it': video,
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
          contact: [person],
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
                value: image,
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
                value: image,
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

const setupDetailPageContact = async ({
  tenantId,
  homeId,
  noFormTitle,
}: {
  tenantId: string;
  homeId: string;
  noFormTitle: boolean;
}): Promise<void> => {
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

  const sampleForm = await generateRegularForm(tenantId, noFormTitle);

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

const setupMagazineDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const detailPage = await generateMagazineDetailPage({
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

  const sampleForm = await generateRegularForm(tenantId);

  const document = await generateDocument({
    payload,
    tenant: tenantId,
  });

  const zenodoDocument = await generateZenodoDocument({
    payload,
    tenant: tenantId,
  });

  const image = await generateImage({
    payload,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'magazineDetailPage',
    data: {
      content: [
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
              value: document,
            },
            {
              relationTo: 'zenodoDocuments',
              value: zenodoDocument,
            },
          ],
          subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
        },

        // image
        {
          alignment: 'center',
          blockType: 'imageBlockMagazine',
          caption: simpleRteConfig('Some caption'),
          credits: simpleRteConfig('Some credits'),
          image,
        },

        // form
        {
          blockType: 'formBlock',
          form: sampleForm,
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

const setupEventDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Category'),
      tenant: tenantId,
    },
    locale: 'de',
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    navigationTitle: 'nav title',
    parentPage: {
      documentId: homeId,
      slug: 'homePage',
    },
    tenant: tenantId,
    title: 'Detail Page',
  });

  const sampleForm = await generateRegularForm(tenantId);

  const document = await generateDocument({
    payload,
    tenant: tenantId,
  });

  const zenodoDocument = await generateZenodoDocument({
    payload,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'eventDetailPage',
    data: {
      blocks: {
        content: [
        // richtext
          {
            blockType: 'textBlock',
            text: sampleRte1,
          },

          // downloads
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
                value: zenodoDocument,
              },
            ],
            subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
          },

          // form
          {
            blockType: 'formBlock',
            form: sampleForm,
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

          // notification
          {
            blockType: 'notificationBlock',
            text: simpleRteConfig('Sample notification text.'),
          },
        ],
      },
    },
    id: detailPage.id,
  });
};

const setupNewsDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const detailPage = await generateNewsDetailPage({
    navigationTitle: 'nav title',
    parentPage: {
      documentId: homeId,
      slug: 'homePage',
    },
    tenant: tenantId,
    title: 'Detail Page',
  });

  await generateNewsPages({
    amount: 5,
    home: homeId,
    tenant: tenantId,
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

  const sampleForm = await generateRegularForm(tenantId);

  const document = await generateDocument({
    payload,
    tenant: tenantId,
  });

  const zenodoDocument = await generateZenodoDocument({
    payload,
    tenant: tenantId,
  });

  const image = await generateImage({
    payload,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'newsDetailPage',
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
              value: document,
            },
            {
              relationTo: 'zenodoDocuments',
              value: zenodoDocument,
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
          image,
        },

        // notification
        {
          blockType: 'notificationBlock',
          text: simpleRteConfig('Sample notification text.'),
        },

        // news teasers
        {
          blockType: 'newsTeasersBlock',
          title: simpleRteConfig('News'),
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

const setupPublicationDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const detailPage = await generatePublicationDetailPage({
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

  await generatePublicationPages({
    amount: 5,
    home: homeId,
    tenant: tenantId,
  });

  const sampleForm = await generateRegularForm(tenantId);

  const document = await generateDocument({
    payload,
    tenant: tenantId,
  });

  const zenodoDocument = await generateZenodoDocument({
    payload,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'publicationDetailPage',
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
              value: document,
            },
            {
              relationTo: 'zenodoDocuments',
              value: zenodoDocument,
            },
          ],
          subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
        },

        // notification
        {
          blockType: 'notificationBlock',
          text: simpleRteConfig('Sample notification text.'),
        },

        // small text
        {
          blockType: 'bibliographicReferenceBlock',
          text: simpleRteConfig('Bibliographic reference'),
        },

        // publications teasers
        {
          blockType: 'publicationsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPageForLinks.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Publication Teasers'),
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

const setupNationalDictionaryDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const detailPage = await generateNationalDictionaryDetailPage({
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

  // add content
  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      content: [
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

        // notification
        {
          blockType: 'notificationBlock',
          text: simpleRteConfig('Sample notification text.'),
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

const setupInstituteDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const detailPage = await generateInstituteDetailPage({
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

  // add content
  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      content: [
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

        // notification
        {
          blockType: 'notificationBlock',
          text: simpleRteConfig('Sample notification text.'),
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

const setupProjectDetailPage = async ({
  tenantId,
  homeId,
}: {
  tenantId: string;
  homeId: string;
}): Promise<void> => {
  await deleteSetsPages();
  await deleteOtherCollections();

  const payload = await getPayloadCached();

  const detailPage = await generateProjectDetailPage({
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

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig('Project Name'),
      tenant: tenantId,
    },
  });

  await generateEventPages({
    amount: 5,
    home: homeId,
    project: project.id,
    tenant: tenantId,
  });

  await generateNewsPages({
    amount: 5,
    home: homeId,
    project: project.id,
    tenant: tenantId,
  });

  await generatePublicationPages({
    amount: 5,
    home: homeId,
    project: project.id,
    tenant: tenantId,
  });

  const sampleForm = await generateRegularForm(tenantId);

  const document = await generateDocument({
    payload,
    tenant: tenantId,
  });

  const zenodoDocument = await generateZenodoDocument({
    payload,
    tenant: tenantId,
  });

  const image = await generateImage({
    payload,
    tenant: tenantId,
  });

  const person = await generatePerson({
    image,
    payload,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'projectDetailPage',
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
              value: document,
            },
            {
              relationTo: 'zenodoDocuments',
              value: zenodoDocument,
            },
          ],
          subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
        },

        // personal contact
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

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
                documentId: detailPageForLinks.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Event Teasers'),
        },

        // news teasers
        {
          blockType: 'newsTeasersBlock',
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: {
                documentId: detailPageForLinks.id,
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
                documentId: detailPageForLinks.id,
                slug: 'detailPage',
              },
              linkText: simpleRteConfig('link'),
            },
          },
          title: simpleRteConfig('Publication Teasers'),
        },
      ],

      // hero
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
      project: project.id,
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
    amount: 5,
    home: homeId,
    tenant: tenantId,
  });

  // create a form
  const sampleForm = await generateRegularForm(tenantId);

  // add image
  const image = await generateImage({
    payload,
    tenant: tenantId,
  });

  const person = await generatePerson({
    image,
    payload,
    tenant: tenantId,
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
          contact: [person],
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
                value: image,
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
                value: image,
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

const setupOverviewWithMagazineOverview = async ({
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

  await generateMagazinePages({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'magazineOverviewBlock',
        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithPublicationsOverview = async ({
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

  await generatePublicationPages({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('Alle Arten'),
          filterTitleAllTopics: simpleRteConfig('Alle Themen'),
          title: simpleRteConfig('Publications'),

        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithEventsOverview = async ({
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

  await generateEventPages({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'eventsOverviewBlock',
          title: simpleRteConfig('Events'),
        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithPeopleOverview = async ({
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

  const team = await generateTeam({
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'peopleOverviewBlock',
          teams: team,
        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithNewsOverview = async ({
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

  await generateNewsPages({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'newsOverviewBlock',
          title: simpleRteConfig('News'),
        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithNationalDictionariesOverview = async ({
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

  await generateNationalDictionaryPages({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'nationalDictionariesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('Weitere Infos'),
        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithInstitutesOverview = async ({
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

  await generateInstituePages({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'institutesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('Weitere infos'),
        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithProjectsOverview = async ({
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

  await generateProjectPages({
    amount: 21,
    home: homeId,
    tenant: tenantId,
  });

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'projectsOverviewBlock',
        },
      ],
      hero: {
        lead: simpleRteConfig('Die SAGW ist das grösste Netzwerk geistes- und sozialwissenschaftlicher Disziplinen in der Schweiz und eine Förderorganisation des Bundes.'),
        title: simpleRteConfig('Für eine starke Wissenschaft und eine informierte Gesellschaft'),
      },
    },
    id: overviewPage.id,
  });
};

const setupOverviewWithEditionsOverview = async ({
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

  // add content
  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'editionsOverview',
          items: {
            items: Array.from({
              length: 21,
            }, (_, i) => {
              const index = i + 1;

              return {
                externalLink: 'https://www.foo.bar',
                text: simpleRteConfig('Editions text'),
                title: simpleRteConfig(`Edition ${index}`),
              };
            }),
            linkText: simpleRteConfig('link text'),
          },
        },
      ],
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
      slug: `tenant-${time}`,
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

test.describe('magazine detail page', () => {
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

    await setupMagazineDetailPage({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupMagazineDetailPage({
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

test.describe('event detail page', () => {
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

    await setupEventDetailPage({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupEventDetailPage({
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

test.describe('news detail page', () => {
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

    await setupNewsDetailPage({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupNewsDetailPage({
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

test.describe('publication detail page', () => {
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

    await setupPublicationDetailPage({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupPublicationDetailPage({
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

test.describe('national dictionary detail page', () => {
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

    await setupNationalDictionaryDetailPage({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupNationalDictionaryDetailPage({
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

test.describe('institute detail page', () => {
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

    await setupInstituteDetailPage({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupInstituteDetailPage({
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

test.describe('project detail page', () => {
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

    await setupProjectDetailPage({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupProjectDetailPage({
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
      slug: `tenant-${time}`,
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

test.describe('overview page with magazine overview', () => {
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

    await setupOverviewWithMagazineOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithMagazineOverview({
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

test.describe('overview page with publications overview', () => {
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

    await setupOverviewWithPublicationsOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithPublicationsOverview({
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

test.describe('overview page with events overview', () => {
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

    await setupOverviewWithEventsOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithEventsOverview({
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

test.describe('overview page with people overview', () => {
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

    await setupOverviewWithPeopleOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithPeopleOverview({
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

test.describe('overview page with news overview', () => {
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

    await setupOverviewWithNewsOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithNewsOverview({
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

test.describe('overview page with national dictionaries overview', () => {
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

    await setupOverviewWithNationalDictionariesOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithNationalDictionariesOverview({
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

test.describe('overview page with institutes overview', () => {
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

    await setupOverviewWithInstitutesOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithInstitutesOverview({
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

test.describe('overview page with projects overview', () => {
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

    await setupOverviewWithProjectsOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithProjectsOverview({
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

test.describe('overview page with editions overview', () => {
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

    await setupOverviewWithEditionsOverview({
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
      slug: `tenant-${time}`,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await setupOverviewWithEditionsOverview({
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

    await page.goto('http://localhost:3000/de/impressum');
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
      slug: `tenant-${time}`,
    });

    await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/impressum`);
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

    await page.goto('http://localhost:3000/de/datenschutzerklaerung');
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
      slug: `tenant-${time}`,
    });

    await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/datenschutzerklaerung`);
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
      slug: `tenant-${time}`,
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

test.describe('contact page', () => {
  beforeEachAcceptCookies();

  test('form without title / with status message', async ({
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

    await deleteSetsPages();
    await deleteOtherCollections();

    await setupDetailPageContact({
      homeId: home,
      noFormTitle: true,
      tenantId: tenant,
    });

    await page.goto('http://localhost:3000/de/detail-page');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('form with title / with status message', async ({
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

    await deleteSetsPages();
    await deleteOtherCollections();

    await setupDetailPageContact({
      homeId: home,
      noFormTitle: false,
      tenantId: tenant,
    });

    await page.goto('http://localhost:3000/de/detail-page');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });

  test('form without title / without status message', async ({
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

    await deleteSetsPages();
    await deleteOtherCollections();

    const statusMessageResult = await hideStatusMessage({
      tenant,
    });

    await setupDetailPageContact({
      homeId: home,
      noFormTitle: true,
      tenantId: tenant,
    });

    await page.goto('http://localhost:3000/de/detail-page');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });

    const payload = await getPayloadCached();

    await payload.update({
      collection: 'statusMessage',
      data: {
        content: {
          show: {
            display: statusMessageResult.initialShow as any,
          },
        },
      },
      id: statusMessageResult.statusMessageId,
    });
  });

  test('form with title / without status message', async ({
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

    await deleteSetsPages();
    await deleteOtherCollections();

    const statusMessageResult = await hideStatusMessage({
      tenant,
    });

    await setupDetailPageContact({
      homeId: home,
      noFormTitle: false,
      tenantId: tenant,
    });

    await page.goto('http://localhost:3000/de/detail-page');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });

    const payload = await getPayloadCached();

    await payload.update({
      collection: 'statusMessage',
      data: {
        content: {
          show: {
            display: statusMessageResult.initialShow as any,
          },
        },
      },
      id: statusMessageResult.statusMessageId,
    });
  });
});
