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

export const SampleStory: StrictStory = {
  args: {
    currentLang: 'de',
    items: [
      'de',
      'fr',
    ],
    onLangSelect: () => {
      console.log('lang select handler');
    },
  },
};
