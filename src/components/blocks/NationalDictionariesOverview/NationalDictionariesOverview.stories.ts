import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NationalDictionaryOverviewComponent } from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.component';
import { defaultDecorator } from '@/storybook-helpers';
import { NationalDictionaryDetailPage } from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { prerenderPageLinksStorybook } from '@/utilities/prerenderPageLinksStorybook';

type NationalDictionariesOverviewProps = React.ComponentProps<typeof NationalDictionaryOverviewComponent>;

type StrictStory = StoryObj<typeof NationalDictionaryOverviewComponent> & {
  args: NationalDictionariesOverviewProps;
};

const meta: Meta<typeof NationalDictionaryOverviewComponent> = {
  args: {},
  component: NationalDictionaryOverviewComponent,
  decorators: [defaultDecorator],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'a11y:check',
  ],
  title: 'Components/blocks/NationalDictionariesOverview',
};

export default meta;

const pages: NationalDictionaryDetailPage[] = Array.from({
  length: 12,
}, (_, i) => {
  const index = i + 1;

  return ({
    createdAt: '2025-10-20T12:50:57.693Z',
    hero: {
      colorMode: 'white',
      lead: simpleRteConfig('National Dictionary Detail Page Lead'),
      title: simpleRteConfig(`National Dictionary detail page ${index} title`),
    },
    id: index.toString(),
    navigationTitle: 'National Dictionary Detail',
    overviewPageProps: {
      image: 'some image',
      teaserText: simpleRteConfig('National Dictionary Teaser Text'),
    },
    slug: 'slug',
    tenant: '1',
    updatedAt: '2025-10-20T12:50:57.693Z',
  });
});

export const NationalDictionaries: StrictStory = {
  args: {
    blockType: 'nationalDictionariesOverviewBlock',
    moreInfoButtonText: simpleRteConfig('Weitere Informationen'),
    pageUrls: prerenderPageLinksStorybook({
      pages,
    }),
    pages,
  },
};
