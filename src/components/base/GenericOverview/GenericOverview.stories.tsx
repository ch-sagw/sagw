import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { defaultDecorator } from '@/storybook-helpers';

type GenericOverviewProps = React.ComponentProps<typeof GenericOverview>;

type StrictStory = StoryObj<typeof GenericOverview> & {
  args: GenericOverviewProps;
};

const meta: Meta<typeof GenericOverview> = {
  args: {},
  component: GenericOverview,
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
  ],
  title: 'Components/base/GenericOverview',
};

export default meta;

export const Overview: StrictStory = {
  args: {
    children: Array.from({
      length: 25,
    }, (_, index) => (
      <p key={index}>Random content {index}</p>
    )),
    showPagination: true,
  },
};
