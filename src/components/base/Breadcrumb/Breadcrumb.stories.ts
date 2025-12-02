import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Breadcrumb } from '@/components/base/Breadcrumb/Breadcrumb';
import { defaultDecorator } from '@/storybook-helpers';

type BreadcrumbProps = React.ComponentProps<typeof Breadcrumb>;

type StrictStory = StoryObj<typeof Breadcrumb> & {
  args: BreadcrumbProps;
};

const meta: Meta<typeof Breadcrumb> = {
  args: {},
  component: Breadcrumb,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Breadcrumb',
};

export default meta;

export const OneItem: StrictStory = {
  args: {
    colorMode: 'white',
    items: [
      {
        link: 'https://www.foo.bar',
        text: 'Home',
      },
    ],
  },
};

export const TwoItems: StrictStory = {
  args: {
    colorMode: 'white',
    items: [
      {
        link: 'https://www.foo.bar',
        text: 'Home',
      },
      {
        link: 'https://www.foo.bar',
        text: 'Aktivitäten',
      },
    ],
  },
};
