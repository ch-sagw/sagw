import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Tag } from '@/components/base/Tag/Tag';
import { defaultDecorator } from '@/storybook-helpers';

type TagProps = React.ComponentProps<typeof Tag>;

type StrictStory = StoryObj<typeof Tag> & {
  args: TagProps;
};

const meta: Meta<typeof Tag> = {
  args: {},
  component: Tag,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Tag',
};

export default meta;

export const TagPrimary: StrictStory = {
  args: {
    colorTheme: 'primary',
    text: 'Some text for the tag',
  },
};

export const TagSecondary: StrictStory = {
  args: {
    colorTheme: 'secondary',
    text: 'Some text for the tag',
  },
};

export const TagLarge: StrictStory = {
  args: {
    colorTheme: 'primary',
    large: true,
    text: 'Some text for the tag',
  },
};
