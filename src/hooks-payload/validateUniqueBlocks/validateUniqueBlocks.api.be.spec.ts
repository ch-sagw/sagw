import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { getTenant } from '@/app/providers/TenantProvider.server';

import {
  expect,
  test,
} from '@playwright/test';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

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
                  internalLink: 'https://www.foo.bar',
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
            optionalLink: {
              includeLink: true,
              link: {
                internalLink: 'homePage/someid',
                linkText: simpleRteConfig('Alle Downloads'),
              },
            },
            subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
          },
        ],
        hero: {
          colorMode: 'white',
          lead: simpleRteConfig('Detail Page Lead'),
          title: simpleRteConfig(`Detail page title ${(new Date())} - 1`),
        },
        tenant: await getTenant(),
      },
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
                  internalLink: 'https://www.foo.bar',
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
                  internalLink: 'https://www.foo.bar',
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
            optionalLink: {
              includeLink: true,
              link: {
                internalLink: 'homePage/someid',
                linkText: simpleRteConfig('Alle Downloads'),
              },
            },
            subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
          },
        ],
        hero: {
          colorMode: 'white',
          lead: simpleRteConfig('Detail Page Lead'),
          title: simpleRteConfig(`Detail page title ${(new Date())} - 2`),
        },
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
    .toStrictEqual('{\"data\":{\"collection\":\"detailPage\",\"errors\":[{\"label\":\"Content > Content > Block 1 (Links)\",\"message\":\"The block \\\"linksBlock\\\" is not allowed.\",\"path\":\"content.0.id\"},{\"label\":\"Content > Content > Block 2 (Links)\",\"message\":\"The block \\\"linksBlock\\\" is not allowed.\",\"path\":\"content.1.id\"},{\"label\":\"Content > Content > Block 3 (Downloads)\",\"message\":\"The block \\\"downloadsBlock\\\" is not allowed.\",\"path\":\"content.2.id\"}]},\"isOperational\":true,\"isPublic\":false,\"status\":400,\"name\":\"ValidationError\"}');
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
                  internalLink: 'https://www.foo.bar',
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
            optionalLink: {
              includeLink: true,
              link: {
                internalLink: 'homePage/someid',
                linkText: simpleRteConfig('Alle Downloads'),
              },
            },
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
            optionalLink: {
              includeLink: true,
              link: {
                internalLink: 'homePage/someid',
                linkText: simpleRteConfig('Alle Downloads'),
              },
            },
            subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
          },
        ],
        hero: {
          colorMode: 'white',
          lead: simpleRteConfig('Detail Page Lead'),
          title: simpleRteConfig(`Detail page title ${(new Date())} - 3`),
        },
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
    .toStrictEqual('{\"data\":{\"collection\":\"detailPage\",\"errors\":[{\"label\":\"Content > Content > Block 1 (Links)\",\"message\":\"The block \\\"linksBlock\\\" is not allowed.\",\"path\":\"content.0.id\"},{\"label\":\"Content > Content > Block 2 (Downloads)\",\"message\":\"The block \\\"downloadsBlock\\\" is not allowed.\",\"path\":\"content.1.id\"},{\"label\":\"Content > Content > Block 3 (Downloads)\",\"message\":\"The block \\\"downloadsBlock\\\" is not allowed.\",\"path\":\"content.2.id\"}]},\"isOperational\":true,\"isPublic\":false,\"status\":400,\"name\":\"ValidationError\"}');
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
    .toStrictEqual('{\"data\":{\"collection\":\"overviewPage\",\"errors\":[{\"label\":\"Content > Content > Block 1 (Projects Overview (automatic))\",\"message\":\"The block \\\"projectsOverviewBlock\\\" is not allowed.\",\"path\":\"content.0.id\"},{\"label\":\"Content > Content > Block 2 (Projects Overview (automatic))\",\"message\":\"The block \\\"projectsOverviewBlock\\\" is not allowed.\",\"path\":\"content.1.id\"}]},\"isOperational\":true,\"isPublic\":false,\"status\":400,\"name\":\"ValidationError\"}');
  /* eslint-enable no-useless-escape */

});

