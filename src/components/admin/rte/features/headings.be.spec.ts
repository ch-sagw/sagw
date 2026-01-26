import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

const rteContent = {
  root: {

    children: [

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'h1',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        tag: 'h1',
        type: 'heading',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'text',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'h2',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        tag: 'h2',
        type: 'heading',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'text',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'h3',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        tag: 'h3',
        type: 'heading',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'text',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'h4',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        tag: 'h4',
        type: 'heading',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'text',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'h5',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        tag: 'h5',
        type: 'heading',
        version: 1,
      },

      {

        children: [

          {
            detail: 0,
            mode: 'normal',
            style: '',
            text: 'text',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    indent: 0,
    type: 'root',
    version: 1,
  },
};

test.describe('heading levels and ids', () => {
  beforeEachAcceptCookies();
  test('renders proper heading levels in rte', async ({
    page,
  }) => {
    await deleteSetsPages();

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
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: rteContent,
          },
        ],
      },
      id: detailPage.id,
    });

    await page.goto(`http://localhost:3000/de/detail-${time}`);
    await page.waitForLoadState('networkidle');

    const h2 = (await page.locator('h2')).nth(0);
    const h3 = (await page.locator('h3')).nth(0);
    const h4 = (await page.locator('h4')).nth(0);
    const h5 = (await page.locator('h5')).nth(0);
    const h6 = (await page.locator('h6')).nth(0);

    await expect(h2)
      .toHaveText('h1');
    await expect(h3)
      .toHaveText('h2');
    await expect(h4)
      .toHaveText('h3');
    await expect(h5)
      .toHaveText('h4');
    await expect(h6)
      .toHaveText('h5');

  });
});
