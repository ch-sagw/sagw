import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NetworkTeaser } from '@/components/blocks/NetworkTeaser/NetworkTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { NetworkCategory } from '@/payload-types';

type NetworkTeaserProps = React.ComponentProps<typeof NetworkTeaser>;

type StrictStory = StoryObj<typeof NetworkTeaser> & {
  args: NetworkTeaserProps;
};

const meta: Meta<typeof NetworkTeaser> = {
  args: {},
  component: NetworkTeaser,
  decorators: [defaultDecorator],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/NetworkTeaser',
};

export default meta;

const getCategory = (number: string): NetworkCategory => ({
  createdAt: '2025-11-20T08:12:13.059Z',
  id: number,
  name: simpleRteConfig(`Category ${number}`),
  updatedAt: '2025-11-20T08:12:13.059Z',
});

const getNetworkItem = (number: string, category: string): NetworkTeaserProps['items']['items'][number] => ({
  category: getCategory(category),
  externalLink: 'https://www.foo.bar',
  foundingYear: 1983,
  id: number,
  image: 'some-image.jpg',
  title: simpleRteConfig(`Network item ${number}`),
});

export const NetworkTeasers: StrictStory = {
  args: {
    blockType: 'networkTeasersBlock',
    filter: {
      allCheckboxText: simpleRteConfig('Alle Fachgesellschaften'),
      title: simpleRteConfig('Fachgesellschaften'),
    },
    items: {
      foundingYearText: simpleRteConfig('Gründungsjahr'),
      items: [
        getNetworkItem('1', '1'),
        getNetworkItem('2', '2'),
        getNetworkItem('3', '3'),
        getNetworkItem('4', '1'),
        getNetworkItem('5', '2'),
        getNetworkItem('6', '3'),
        getNetworkItem('7', '1'),
        getNetworkItem('8', '2'),
        getNetworkItem('9', '3'),
        getNetworkItem('10', '1'),
        getNetworkItem('11', '2'),
        getNetworkItem('12', '3'),
      ],
      linkText: simpleRteConfig('Öffnen'),
    },
  },
};
