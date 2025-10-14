import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Radios } from '@/components/base/Radios/Radios';
import { defaultDecorator } from '@/storybook-helpers';

type RadiosProps = React.ComponentProps<typeof Radios>;

type StrictStory = StoryObj<typeof Radios> & {
  args: RadiosProps;
};

const meta: Meta<typeof Radios> = {
  args: {},
  component: Radios,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Radios',
};

export default meta;

const radioItems = [
  {
    label: 'Radio One with super long label text to see text wrap',
    value: 'radio-one',
  },
  {
    checked: true,
    label: 'Radio Two',
    value: 'radio-two',
  },
  {
    label: 'Radio Three',
    value: 'radio-three',
  },
];

export const WhiteMode: StrictStory = {
  args: {
    colorTheme: 'white',
    descriptionLabel: 'In welcher Sprache möchten sie den Newsletter abonnieren?',
    errorText: '',
    items: radioItems,
    name: 'radios',
  },
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
};

export const LightMode: StrictStory = {
  args: {
    colorTheme: 'light',
    descriptionLabel: 'In welcher Sprache möchten sie den Newsletter abonnieren?',
    errorText: '',
    items: radioItems,
    name: 'radios',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const DarkMode: StrictStory = {
  args: {
    colorTheme: 'dark',
    descriptionLabel: 'In welcher Sprache möchten sie den Newsletter abonnieren?',
    errorText: '',
    items: radioItems,
    name: 'radios',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const Error: StrictStory = {
  args: {
    colorTheme: 'dark',
    descriptionLabel: 'In welcher Sprache möchten sie den Newsletter abonnieren?',
    errorText: 'Sie müssen eine Auswahl treffen.',
    items: radioItems,
    name: 'radios',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
