import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type PaginationProps = React.ComponentProps<typeof Pagination>;

type StrictStory = StoryObj<typeof Pagination> & {
  args: PaginationProps;
};

const meta: Meta<typeof Pagination> = {
  args: {},
  component: Pagination,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Pagination',
};

export default meta;

export const Pages5: StrictStory = {
  args: {
    currentPage: 1,
    totalPages: 5,
  },
};

export const Pages10: StrictStory = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const Pages20: StrictStory = {
  args: {
    currentPage: 1,
    totalPages: 20,
  },
};

export const Pages10Active5: StrictStory = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
};

export const Pages10Active6: StrictStory = {
  args: {
    currentPage: 6,
    totalPages: 10,
  },
};

export const Pages10Active7: StrictStory = {
  args: {
    currentPage: 7,
    totalPages: 10,
  },
};

export const Pages10Active10: StrictStory = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};
