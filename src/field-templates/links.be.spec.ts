import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import {
  expect,
  test,
} from '@playwright/test';
import { getTenant } from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { EventDetailPage } from '@/payload-types';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';

test.describe('links', () => {
  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('throws error on invalid external url', async () => {
    const tenant = await getTenant();
    const payload = await getPayload({
      config: configPromise,
    });

    let result;

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createEventResult = await payload.create({
        collection: 'eventDetailPage',
        data: {
          _status: 'published',
          eventDetails: {
            date: '2025-08-31T12:00:00.000Z',
            title: simpleRteConfig(`${(new Date())
              .toString()} - 1`),
          },
          link: {
            externalLink: '.foo.bar',
          },
          showDetailPage: 'false',
          slug: `${(new Date())
            .toString()} - 1`,
          tenant,
        },
        draft: false,
      });

      result = createEventResult;
    /* eslint-enable @typescript-eslint/naming-convention */
    } catch (e) {
      result = JSON.stringify(e);
    }

    /* eslint-disable no-useless-escape */
    await expect(result)
      .toStrictEqual('{\"data\":{\"collection\":\"eventDetailPage\",\"errors\":[{\"label\":\"Content > Link > External Link\",\"message\":\"The URL has an invalid format. The URL must have a format like https://www.google.com, https://google.com, or www.google.com.\",\"path\":\"link.externalLink\"}]},\"isOperational\":true,\"isPublic\":true,\"status\":400,\"name\":\"ValidationError\"}');
    /* eslint-enable no-useless-escape */

  });

  test('does not throw an error on valid external url', async () => {
    const tenant = await getTenant();
    const payload = await getPayload({
      config: configPromise,
    });

    let result: EventDetailPage | undefined;

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createEventResult = await payload.create({
        collection: 'eventDetailPage',
        data: {
          _status: 'published',
          eventDetails: {
            date: '2025-08-31T12:00:00.000Z',
            title: simpleRteConfig(`${(new Date())
              .toString()} - 2`),
          },
          link: {
            externalLink: 'https://www.foo.bar',
          },
          showDetailPage: 'false',
          slug: `${(new Date())
            .toString()} - 2`,
          tenant,
        },
        draft: false,
      });

      result = createEventResult;
    /* eslint-enable @typescript-eslint/naming-convention */
    } catch {
      result = undefined;
    }

    const linkResult = result?.link?.externalLink;

    await expect(linkResult)
      .toStrictEqual('https://www.foo.bar');

  });

  test('does not throw an error on valid external url with path segment', async () => {
    const tenant = await getTenant();
    const payload = await getPayload({
      config: configPromise,
    });

    let result: EventDetailPage | undefined;

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createEventResult = await payload.create({
        collection: 'eventDetailPage',
        data: {
          _status: 'published',
          eventDetails: {
            date: '2025-07-31T12:00:00.000Z',
            title: simpleRteConfig(`${(new Date())
              .toString()} - 3`),
          },
          link: {
            externalLink: 'https://www.foo.bar/baz',
          },
          showDetailPage: 'false',
          slug: `${(new Date())
            .toString()} - 3`,
          tenant,
        },
        draft: false,
      });

      result = createEventResult;
    /* eslint-enable @typescript-eslint/naming-convention */
    } catch {
      result = undefined;
    }

    const linkResult = result?.link?.externalLink;

    await expect(linkResult)
      .toStrictEqual('https://www.foo.bar/baz');

  });

  test('does not throw an error on valid external without www', async () => {
    const tenant = await getTenant();
    const payload = await getPayload({
      config: configPromise,
    });

    let result: EventDetailPage | undefined;

    try {
    /* eslint-disable @typescript-eslint/naming-convention */
      const createEventResult = await payload.create({
        collection: 'eventDetailPage',
        data: {
          _status: 'published',
          eventDetails: {
            date: '2025-07-31T12:00:00.000Z',
            title: simpleRteConfig(`${(new Date())
              .toString()} - 4`),
          },
          link: {
            externalLink: 'https://foo.bar',
          },
          showDetailPage: 'false',
          slug: `${(new Date())
            .toString()} - 4`,
          tenant,
        },
        draft: false,
      });

      result = createEventResult;

    /* eslint-enable @typescript-eslint/naming-convention */
    } catch {
      result = undefined;
    }

    const linkResult = result?.link?.externalLink;

    await expect(linkResult)
      .toStrictEqual('https://foo.bar');

  });
});
