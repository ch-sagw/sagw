import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { SocialLinks } from '@/components/base/SocialLinks/SocialLinks';
import { defaultDecorator } from '@/storybook-helpers';

type SocialLinksProps = React.ComponentProps<typeof SocialLinks>;

type StrictStory = StoryObj<typeof SocialLinks> & {
  args: SocialLinksProps;
};

const meta: Meta<typeof SocialLinks> = {
  args: {},
  component: SocialLinks,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Footer/SocialLinks',
};

export default meta;

export const AllPlatforms: StrictStory = {
  args: {
    items: [
      {
        icon: 'linkedIn',
        link: 'https://www.foo.bar',
        text: 'Link to social media profile of SAGW',
      },
      {
        icon: 'facebook',
        link: 'https://www.foo.bar',
        text: 'Link to social media profile of SAGW',
      },
      {
        icon: 'instagram',
        link: 'https://www.foo.bar',
        text: 'Link to social media profile of SAGW',
      },
      {
        icon: 'twitter',
        link: 'https://www.foo.bar',
        text: 'Link to social media profile of SAGW',
      },
    ],
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
