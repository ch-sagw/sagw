import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NewsOverview } from '@/components/blocks/NewsOverview/NewsOverview';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type NewsOverviewProps = React.ComponentProps<typeof NewsOverview>;

type StrictStory = StoryObj<typeof NewsOverview> & {
  args: NewsOverviewProps;
};

const meta: Meta<typeof NewsOverview> = {
  args: {},
  component: NewsOverview,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/NewsOverview',
};

export default meta;

export const DefaultOverview: StrictStory = {
  args: {
    blockType: 'newsOverviewBlock',
    language: 'de',
    tenant: 'someTenantId',
    title: simpleRteConfig('News'),
  },
};
