import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Downloads } from '@/components/blocks/Downloads/Downloads';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type DownloadsProps = React.ComponentProps<typeof Downloads>;

type StrictStory = StoryObj<typeof Downloads> & {
  args: DownloadsProps;
};

const meta: Meta<typeof Downloads> = {
  args: {},
  component: Downloads,
  decorators: [defaultDecoratorNoPadding],
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Downloads',
};

export default meta;

export const DownloadsBlock: StrictStory = {
  args: {
    blockType: 'downloadsBlock',
    customOrAuto: 'custom',
    downloads: [
      {
        relationTo: 'documents',
        value: {
          createdAt: '2025-10-20T12:50:57.693Z',
          date: '2025-10-30T00:00:00.000Z',
          filename: 'sagw.pdf',
          filesize: 250400,
          id: '68f630312362405afa4762ea',
          mimeType: 'application/pdf',
          thumbnailURL: null,
          title: simpleRteConfig('Sample Regular Document'),
          updatedAt: '2025-10-20T12:50:57.693Z',
          url: '/api/documents/file/sagw.pdf',
        },
      },
      {
        relationTo: 'zenodoDocuments',
        value: {
          createdAt: '2025-10-20T12:50:57.727Z',
          files: [
            {
              format: 'zip',
              id: 'someid',
              link: 'https://foo.bar',
              size: 1.54,
            },
            {
              format: 'pdf',
              id: 'someid',
              link: 'https://foo.bar',
              size: 0.31,
            },
          ],
          id: '68f630312362405afa4762f0',
          publicationDate: '1919-05-01',
          title: 'Sample Zenodo Document',
          updatedAt: '2025-10-20T12:50:57.727Z',
          zenodoId: '1512691',
        },
      },
    ],
    subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
    title: simpleRteConfig('Downloads'),
  },
};

export const DownloadsBlockWithoutLinkAndSubtitle: StrictStory = {
  args: {
    blockType: 'downloadsBlock',
    customOrAuto: 'custom',
    downloads: DownloadsBlock.args.downloads,
    title: simpleRteConfig('Downloads'),
  },
};
