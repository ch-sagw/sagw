import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import {
  expect,
  test,
} from '@playwright/test';
import { getTenant } from '@/app/providers/TenantProvider.server';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { EventDetailPage } from '@/payload-types';

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
          title: simpleRteConfig('some title'),
        },
        hero: {
          colorMode: 'white',
          title: simpleRteConfig('some title'),
        },
        link: {
          externalLink: '.foo.bar',
          externalLinkText: simpleRteConfig('External Link'),
        },
        showDetailPage: 'false',
        tenant,
      },
    });

    result = createEventResult;
    /* eslint-enable @typescript-eslint/naming-convention */
  } catch (e) {
    result = JSON.stringify(e);
  }

  /* eslint-disable no-useless-escape */
  await expect(result)
    .toStrictEqual('{\"data\":{\"collection\":\"eventDetailPage\",\"errors\":[{\"label\":\"Content > Link > External Link\",\"message\":\"The URL has an invalid format. The URL must have a format like https://www.google.com or www.google.com.\",\"path\":\"link.externalLink\"}]},\"isOperational\":true,\"isPublic\":false,\"status\":400,\"name\":\"ValidationError\"}');
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
          title: simpleRteConfig('some title'),
        },
        hero: {
          colorMode: 'white',
          title: simpleRteConfig('some title'),
        },
        link: {
          externalLink: 'https://www.foo.bar',
          externalLinkText: simpleRteConfig('External Link'),
        },
        showDetailPage: 'false',
        tenant,
      },
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
