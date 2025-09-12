import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Navigation } from '@/components/global/Navigation/Navigation';
import { defaultDecorator } from '@/storybook-helpers';

type NavigationProps = React.ComponentProps<typeof Navigation>;

type StrictStory = StoryObj<typeof Navigation> & {
  args: NavigationProps;
};

const meta: Meta<typeof Navigation> = {
  args: {},
  component: Navigation,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Navigation',
};

export default meta;

export const SampleNavigation: StrictStory = {
  args: {
    navItems: [
      {
        navItemText: 'item 1',
      },
      {
        navItemText: 'item 2',
      },
    ],
  },
};
