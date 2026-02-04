import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { DownloadsComponent as Downloads } from '@/components/blocks/Downloads/Downloads.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import type { InterfaceDownloadLinkItemPropTypes } from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import { rteToHtml } from '@/utilities/rteToHtml';
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
    items: [
      {
        date: '2025-10-30T00:00:00.000Z',
        format: 'PDF',
        link: {
          href: '/api/documents/file/sagw.pdf',
          target: '_blank' as const,
        },
        size: '246 KB',
        title: rteToHtml(simpleRteConfig('Sample Regular Document')),
        type: 'download' as const,
      },
      {
        date: (new Date('1919-05-01'))
          .toString(),
        format: 'ZIP',
        link: {
          href: 'https://foo.bar',
          target: '_blank' as const,
        },
        size: '1.54 MB',
        title: 'Sample Zenodo Document - 1 / 2',
        type: 'download' as const,
      },
      {
        date: (new Date('1919-05-01'))
          .toString(),
        format: 'PDF',
        link: {
          href: 'https://foo.bar',
          target: '_blank' as const,
        },
        size: '317 KB',
        title: 'Sample Zenodo Document - 2 / 2',
        type: 'download' as const,
      },
    ] as InterfaceDownloadLinkItemPropTypes[],
    subtitle: rteToHtml(simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe')),
    title: rteToHtml(simpleRteConfig('Downloads')),
  },
};

export const DownloadsBlockWithoutLinkAndSubtitle: StrictStory = {
  args: {
    items: DownloadsBlock.args.items,
    title: DownloadsBlock.args.title,
  },
};
