import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { defaultDecorator } from '@/storybook-helpers';

type PaginationProps = React.ComponentProps<typeof Pagination>;

type StrictStory = StoryObj<typeof Pagination> & {
  args: PaginationProps;
};

const meta: Meta<typeof Pagination> = {
  args: {},
  component: Pagination,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
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
    paginationTitle: 'Pagination',
    totalPages: 5,
  },
};

export const Pages10: StrictStory = {
  args: {
    currentPage: 1,
    paginationTitle: 'Pagination',
    totalPages: 10,
  },
};

export const Pages20: StrictStory = {
  args: {
    currentPage: 1,
    paginationTitle: 'Pagination',
    totalPages: 20,
  },
};

export const Pages10Active5: StrictStory = {
  args: {
    currentPage: 5,
    paginationTitle: 'Pagination',
    totalPages: 10,
  },
};

export const Pages10Active6: StrictStory = {
  args: {
    currentPage: 6,
    paginationTitle: 'Pagination',
    totalPages: 10,
  },
};

export const Pages10Active7: StrictStory = {
  args: {
    currentPage: 7,
    paginationTitle: 'Pagination',
    totalPages: 10,
  },
};
