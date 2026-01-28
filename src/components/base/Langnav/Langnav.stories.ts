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

const items = [
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
];

export const LangNavDark: StrictStory = {
  args: {
    colorMode: 'dark',
    currentLang: 'de',
    description: 'Die SAGW Webseite ist in vier Sprachen verfügbar',
    items,
    onLangSelectAction: () => {
      console.log('lang select handler');
    },
    title: 'Sprachen',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LangNavLight: StrictStory = {
  args: {
    colorMode: 'light',
    currentLang: 'de',
    description: 'Die SAGW Webseite ist in vier Sprachen verfügbar',
    items,
    onLangSelectAction: () => {
      console.log('lang select handler');
    },
    title: 'Sprachen',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LangNavWhite: StrictStory = {
  args: {
    colorMode: 'white',
    currentLang: 'de',
    description: 'Die SAGW Webseite ist in vier Sprachen verfügbar',
    items,
    onLangSelectAction: () => {
      console.log('lang select handler');
    },
    title: 'Sprachen',
  },
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
};
