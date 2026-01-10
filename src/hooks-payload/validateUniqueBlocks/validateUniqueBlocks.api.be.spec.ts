import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  generateTenant, getTenant,
} from '@/test-helpers/tenant-generator';

import {
  expect,
  test,
} from '@playwright/test';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';

test.describe('unique-blocks', () => {
  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('allows 1 link and 1 downloads block via API', async () => {
    const tenant = await getTenant();
    const payload = await getPayload({
      config: configPromise,
    });

    let result: any;

    try {
      const document = await payload.create({
        collection: 'documents',
        data: {
          date: '2025-10-30',
          tenant,
          title: simpleRteConfig('Doc title'),
        },
        filePath: 'src/seed/test-data/assets/sagw.pdf',
      });
      const zenodo = await payload.create({
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

      /* eslint-disable @typescript-eslint/naming-convention */

      const createDetailPageResult = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [

            // links block
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
                      documentId: '12345',
                      slug: 'some-slug',
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

            // downloads block
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
                  value: zenodo.id,
                },
              ],
              subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Detail Page Lead'),
            title: simpleRteConfig(`Detail page title ${(new Date())} - 1`),
          },
          slug: `detail-page-title-${(new Date())}-1`,
          tenant: await getTenant(),
        },
        draft: false,
      });

      result = createDetailPageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    await expect(result['_status'])
      .toStrictEqual('published');

  });

  test('errors with 2 links and 1 downloads block via API', async () => {
    let result: any;
    const tenant = await getTenant();
    const payload = await getPayload({
      config: configPromise,
    });

    try {
      const document = await payload.create({
        collection: 'documents',
        data: {
          date: '2025-10-30',
          tenant,
          title: simpleRteConfig('Doc title'),
        },
        filePath: 'src/seed/test-data/assets/sagw.pdf',
      });
      const zenodo = await payload.create({
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

      /* eslint-disable @typescript-eslint/naming-convention */
      const createDetailPageResult = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [

            // links block
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
                      documentId: '12345',
                      slug: 'some-slug',
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
                      documentId: '12345',
                      slug: 'some-slug',
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

            // downloads block
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
                  value: zenodo.id,
                },
              ],
              subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Detail Page Lead'),
            title: simpleRteConfig(`Detail page title ${(new Date())} - 2`),
          },
          slug: `detail-page-title-${(new Date())}-2`,
          tenant: await getTenant(),
        },
        draft: false,
      });

      result = createDetailPageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    /* eslint-disable no-useless-escape */
    await expect(result)
      .toStrictEqual('{\"data\":{\"collection\":\"detailPage\",\"errors\":[{\"label\":\"Content > Content > Block 1 (Links)\",\"message\":\"The block \\\"linksBlock\\\" is not allowed.\",\"path\":\"content.0.id\"},{\"label\":\"Content > Content > Block 2 (Links)\",\"message\":\"The block \\\"linksBlock\\\" is not allowed.\",\"path\":\"content.1.id\"},{\"label\":\"Content > Content > Block 3 (Downloads)\",\"message\":\"The block \\\"downloadsBlock\\\" is not allowed.\",\"path\":\"content.2.id\"}]},\"isOperational\":true,\"isPublic\":true,\"status\":400,\"name\":\"ValidationError\"}');
    /* eslint-enable no-useless-escape */

  });

  test('errors with 1 link and 2 downloads block via API', async () => {
    let result: any;
    const tenant = await getTenant();
    const payload = await getPayload({
      config: configPromise,
    });

    try {
      const document = await payload.create({
        collection: 'documents',
        data: {
          date: '2025-10-30',
          tenant,
          title: simpleRteConfig('Doc title'),
        },
        filePath: 'src/seed/test-data/assets/sagw.pdf',
      });
      const zenodo = await payload.create({
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

      /* eslint-disable @typescript-eslint/naming-convention */
      const createDetailPageResult = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [

            // links block
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
                      documentId: '12345',
                      slug: 'some-slug',
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

            // downloads block
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
                  value: zenodo.id,
                },
              ],
              subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
            },
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
                  value: zenodo.id,
                },
              ],
              subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Detail Page Lead'),
            title: simpleRteConfig(`Detail page title ${(new Date())} - 3`),
          },
          slug: `detail-page-title-${(new Date())}-3`,
          tenant: await getTenant(),
        },
      });

      result = createDetailPageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    /* eslint-disable no-useless-escape */
    await expect(result)
      .toStrictEqual('{\"data\":{\"collection\":\"detailPage\",\"errors\":[{\"label\":\"Content > Content > Block 1 (Links)\",\"message\":\"The block \\\"linksBlock\\\" is not allowed.\",\"path\":\"content.0.id\"},{\"label\":\"Content > Content > Block 2 (Downloads)\",\"message\":\"The block \\\"downloadsBlock\\\" is not allowed.\",\"path\":\"content.1.id\"},{\"label\":\"Content > Content > Block 3 (Downloads)\",\"message\":\"The block \\\"downloadsBlock\\\" is not allowed.\",\"path\":\"content.2.id\"}]},\"isOperational\":true,\"isPublic\":true,\"status\":400,\"name\":\"ValidationError\"}');
    /* eslint-enable no-useless-escape */

  });

  test('allows 1 overview block via API', async () => {
    let result: any;

    const payload = await getPayload({
      config: configPromise,
    });

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createOverviewPageResult = await payload.create({
        collection: 'overviewPage',
        data: {
          _status: 'published',
          content: [
            {
              blockType: 'projectsOverviewBlock',
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig(`Overview page title ${new Date()} - 1`),
          },
          slug: `overview-page-title-${(new Date())}-1`,
          tenant: await getTenant(),
        },
      });

      result = createOverviewPageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    await expect(result['_status'])
      .toStrictEqual('published');

  });

  test('errors with 2 overview blocks via API', async () => {
    let result: any;
    const payload = await getPayload({
      config: configPromise,
    });

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createOverviewPageResult = await payload.create({
        collection: 'overviewPage',
        data: {
          _status: 'published',
          content: [
            {
              blockType: 'projectsOverviewBlock',
            },
            {
              blockType: 'projectsOverviewBlock',
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig(`Overview page title ${new Date()} - 2`),
          },
          slug: `overview-page-title-${(new Date())}-2`,
          tenant: await getTenant(),
        },
      });

      result = createOverviewPageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    /* eslint-disable no-useless-escape */
    await expect(result)
      .toStrictEqual('{\"data\":{\"collection\":\"overviewPage\",\"errors\":[{\"label\":\"Content > Content > Block 1 (Projects Overview (automatic))\",\"message\":\"The block \\\"projectsOverviewBlock\\\" is not allowed.\",\"path\":\"content.0.id\"},{\"label\":\"Content > Content > Block 2 (Projects Overview (automatic))\",\"message\":\"The block \\\"projectsOverviewBlock\\\" is not allowed.\",\"path\":\"content.1.id\"}]},\"isOperational\":true,\"isPublic\":true,\"status\":400,\"name\":\"ValidationError\"}');
    /* eslint-enable no-useless-escape */

  });

  test('allows 1 same teaser block via API', async () => {
    let result: any;
    const payload = await getPayload({
      config: configPromise,
    });

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createOverviewPageResult = await payload.create({
        collection: 'overviewPage',
        data: {
          _status: 'published',
          content: [
            {
              blockType: 'eventsTeasersBlock',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'magazineTeasersBlock',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'newsTeasersBlock',
              colorMode: 'white',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'publicationsTeasersBlock',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'projectsTeasersBlock',
              title: simpleRteConfig('random title'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig(`Overview page title ${new Date()} - 3`),
          },
          slug: `overview-page-title-${(new Date())}-3`,
          tenant: await getTenant(),
        },
      });

      result = createOverviewPageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    await expect(result['_status'])
      .toStrictEqual('published');

  });

  test('errors with 2 same teasers blocks via API', async () => {
    let result: any;
    const payload = await getPayload({
      config: configPromise,
    });

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createOverviewPageResult = await payload.create({
        collection: 'overviewPage',
        data: {
          _status: 'published',
          content: [
            {
              blockType: 'projectsTeasersBlock',
              title: simpleRteConfig('some title'),
            },
            {
              blockType: 'projectsTeasersBlock',
              title: simpleRteConfig('some title'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig(`Overview page title ${new Date()} - 4`),
          },
          slug: `overview-page-title-${(new Date())}-4`,
          tenant: await getTenant(),
        },
      });

      result = createOverviewPageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    /* eslint-disable no-useless-escape */
    await expect(result)
      .toStrictEqual('{\"data\":{\"collection\":\"overviewPage\",\"errors\":[{\"label\":\"Content > Content > Block 1 (Projects Teasers (automatic))\",\"message\":\"The block \\\"projectsTeasersBlock\\\" is not allowed.\",\"path\":\"content.0.id\"},{\"label\":\"Content > Content > Block 2 (Projects Teasers (automatic))\",\"message\":\"The block \\\"projectsTeasersBlock\\\" is not allowed.\",\"path\":\"content.1.id\"}]},\"isOperational\":true,\"isPublic\":true,\"status\":400,\"name\":\"ValidationError\"}');
    /* eslint-enable no-useless-escape */

  });

  test('home allows 1 teaser block via API', async () => {
    let result: any;
    const payload = await getPayload({
      config: configPromise,
    });

    try {
      const tenant = await generateTenant({
        name: `${(new Date())
          .getTime()}`,
      });

      /* eslint-disable @typescript-eslint/naming-convention */
      const createHomePageResult = await payload.create({
        collection: 'homePage',
        data: {
          _status: 'published',
          content: [
            {
              blockType: 'homeTeasersBlock',
            },
            {
              blockType: 'eventsTeasersBlock',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'magazineTeasersBlock',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'newsTeasersBlock',
              colorMode: 'white',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'publicationsTeasersBlock',
              title: simpleRteConfig('random title'),
            },
            {
              blockType: 'projectsTeasersBlock',
              title: simpleRteConfig('random title'),
            },
          ],
          hero: {
            lead: simpleRteConfig('Overview Page Lead'),
            sideTitle: simpleRteConfig('Side title'),
            title: simpleRteConfig(`Overview page title ${new Date()} - 3`),
          },
          navigationTitle: 'Home',
          tenant: tenant.id,
        },
      });

      result = createHomePageResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    await expect(result['_status'])
      .toStrictEqual('published');

  });
});
