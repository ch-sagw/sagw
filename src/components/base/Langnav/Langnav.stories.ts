import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Langnav } from '@/components/base/Langnav/Langnav';
import { defaultDecorator } from '@/storybook-helpers';

type LangnavProps = React.ComponentProps<typeof Langnav>;

type StrictStory = StoryObj<typeof Langnav> & {
  args: LangnavProps;
};

const meta: Meta<typeof Langnav> = {
  args: {},
  component: Langnav,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Langnav',
};

export default meta;

export const DefaultLangNav: StrictStory = {
  args: {
    currentLang: 'de',
    items: [
      {
        shortText: 'De',
        text: 'Deutsch',
        value: 'de',
      },
      {
        shortText: 'Fr',
        text: 'Français',
        value: 'fr',
      },
      {
        shortText: 'It',
        text: 'Italiano',
        value: 'it',
      },
      {
        shortText: 'En',
        text: 'English',
        value: 'en',
      },
    ],
    onLangSelect: () => {
      console.log('lang select handler');
    },
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
