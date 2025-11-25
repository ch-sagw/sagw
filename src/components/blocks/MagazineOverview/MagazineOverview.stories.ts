import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { MagazineOverviewComponent } from '@/components/blocks/MagazineOverview/MagazineOverview.component';
import { defaultDecorator } from '@/storybook-helpers';
import { MagazineDetailPage } from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type MagazineOverviewProps = React.ComponentProps<typeof MagazineOverviewComponent>;

type StrictStory = StoryObj<typeof MagazineOverviewComponent> & {
  args: MagazineOverviewProps;
};

const meta: Meta<typeof MagazineOverviewComponent> = {
  args: {},
  component: MagazineOverviewComponent,
  decorators: [defaultDecorator],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    // TODO: enable after image is integrated
    // 'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/MagazineOverview',
};

export default meta;

const pages: MagazineDetailPage[] = Array.from({
  length: 12,
}, (_, i) => {
  const index = i + 1;

  return ({
    content: [
      {
        alignement: 'center',
        blockType: 'imageBlock',
        credits: simpleRteConfig('some credits'),
        image: 'some-image',
      },
    ],
    createdAt: '2025-10-20T12:50:57.693Z',
    hero: {
      author: simpleRteConfig('Author'),
      colorMode: 'white',
      date: `2030-08-${index < 10
        ? `0${index}`
        : index}T12:00:00.000Z`,
      lead: simpleRteConfig('Magazine Detail Page Lead'),
      title: simpleRteConfig(`Magazine detail page ${index}`),
    },
    id: index.toString(),
    navigationTitle: `Article ${index}`,
    overviewPageProps: {
      teaserText: simpleRteConfig('Magazine Detail Teaser Text'),
    },
    slug: 'slug',
    tenant: '1',
    updatedAt: '2025-10-20T12:50:57.693Z',
  });
});

export const SampleStory: StrictStory = {
  args: {
    blockType: 'magazineOverviewBlock',
    pageLanguage: 'de',
    pages,
  },
};
