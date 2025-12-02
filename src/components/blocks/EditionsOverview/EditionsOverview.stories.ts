import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EditionsOverview } from '@/components/blocks/EditionsOverview/EditionsOverview';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type EditionsOverviewProps = React.ComponentProps<typeof EditionsOverview>;

type StrictStory = StoryObj<typeof EditionsOverview> & {
  args: EditionsOverviewProps;
};

const meta: Meta<typeof EditionsOverview> = {
  args: {},
  component: EditionsOverview,
  decorators: [defaultDecorator],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/EditionsOverview',
};

export default meta;

export const Overview: StrictStory = {
  args: {
    blockType: 'editionsOverview',
    items: {
      items: Array.from({
        length: 22,
      }, (_, i) => {
        const index = i + 1;

        return {
          externalLink: 'https://www.foo.bar',
          text: simpleRteConfig('Editions text'),
          title: simpleRteConfig(`Edition ${index}`),
        };
      }),
      linkText: simpleRteConfig('some link'),
    },
  },
};
