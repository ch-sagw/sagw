import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PaginationItem } from '@/components/base/PaginationItem/PaginationItem';
import { defaultDecorator } from '@/storybook-helpers';

type PaginationItemProps = React.ComponentProps<typeof PaginationItem>;

type StrictStory = StoryObj<typeof PaginationItem> & {
  args: PaginationItemProps;
};

const meta: Meta<typeof PaginationItem> = {
  args: {},
  component: PaginationItem,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/PaginationItem',
};

export default meta;

export const NumberItem: StrictStory = {
  args: {
    number: 15,
    onClick: () => {
      console.log('clicked');
    },
    type: 'number',
  },
};

export const NumberItemActive: StrictStory = {
  args: {
    active: true,
    number: 15,
    onClick: () => {
      console.log('clicked');
    },
    type: 'number',
  },
};

export const FillerItem: StrictStory = {
  args: {
    type: 'filler',
  },
};
