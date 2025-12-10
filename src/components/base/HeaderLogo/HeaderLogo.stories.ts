import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { HeaderLogo } from '@/components/base/HeaderLogo/HeaderLogo';
import { defaultDecorator } from '@/storybook-helpers';

type HeaderLogoProps = React.ComponentProps<typeof HeaderLogo>;

type StrictStory = StoryObj<typeof HeaderLogo> & {
  args: HeaderLogoProps;
};

const meta: Meta<typeof HeaderLogo> = {
  args: {},
  component: HeaderLogo,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/HeaderLogo',
};

export default meta;

export const LogoSagwDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sagw',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSagwLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sagw',
  },
};

export const LogoSagoDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sago',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSagoLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sago',
  },
};

export const LogoSgtkDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgtk',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgtkLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgtk',
  },
};

export const LogoSslasDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sslas',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSslasLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sslas',
  },
};
