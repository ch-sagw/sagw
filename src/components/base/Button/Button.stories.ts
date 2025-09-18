import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { defaultDecorator } from '@/storybook-helpers';

type ButtonProps = React.ComponentProps<typeof Button>;

type StrictStory = StoryObj<typeof Button> & {
  args: ButtonProps;
};

const meta: Meta<typeof Button> = {
  component: Button,
  decorators: [defaultDecorator],
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Button',
};

export default meta;

export const ButtonPrimaryFilled: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    element: 'button',
    style: 'filled',
    text: 'Alle zulassen',
  },
};

export const ButtonPrimaryFilledDark: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'dark',
    element: 'button',
    style: 'filled',
    text: 'Alle ablehnen',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const ButtonPrimaryFilledDarkDisabled: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'dark',
    disabled: true,
    element: 'button',
    style: 'filled',
    text: 'Alle zulassen',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const ButtonPrimaryFilledIconStart: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    element: 'button',
    iconInlineStart: 'menu' as keyof typeof Icon,
    style: 'filled',
    text: 'Sample Button text with an enormously long text',
  },
};

export const ButtonPrimaryFilledIconStartDark: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'dark',
    element: 'button',
    iconInlineStart: 'menu' as keyof typeof Icon,
    style: 'filled',
    text: 'Sample Button text',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const ButtonPrimaryOutlined: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    element: 'button',
    iconInlineStart: 'menu' as keyof typeof Icon,
    style: 'outlined',
    text: 'Sample Button text',
  },
};

export const ButtonPrimaryOutlinedDark: StrictStory = {
  args: {
    ariaHasPopUp: false,
    buttonType: 'button',
    colorTheme: 'dark',
    element: 'button',
    iconInlineStart: 'menu' as keyof typeof Icon,
    style: 'outlined',
    text: 'Sample Button text',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const ButtonText: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    element: 'button',
    iconInlineStart: 'config' as keyof typeof Icon,
    style: 'text',
    text: 'Auswahl anpassen',
  },
};

export const ButtonTextDark: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'dark',
    element: 'button',
    iconInlineStart: 'config' as keyof typeof Icon,
    style: 'text',
    text: 'Auswahl anpassen',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const ButtonLinkPrimaryFilled: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    element: 'link',
    href: 'https://www.sagw.ch',
    style: 'filled',
    target: '_blank',
    text: 'Sample Button text',
  },
};

export const ButtonLinkPrimaryOutlined: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    element: 'link',
    href: 'https://www.sagw.ch',
    style: 'outlined',
    target: '_blank',
    text: 'Sample Button text',
  },
};

export const ButtonLinkText: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    element: 'link',
    href: 'https://www.sagw.ch',
    style: 'text',
    target: '_blank',
    text: 'Sample Button text',
  },
};

export const ButtonLinkTextCurrent: StrictStory = {
  args: {
    ariaCurrent: true,
    ariaHasPopUp: false,
    ariaLabel: 'Deutsch',
    colorTheme: 'light',
    element: 'link',
    href: '/de',
    style: 'text',
    text: 'DE',
  },
};

export const ButtonLinkSocial: StrictStory = {
  args: {
    ariaLabel: 'Die SAGW auf Linkedin',
    colorTheme: 'dark',
    element: 'link',
    href: 'https://www.linkedin.com/company/sagwassh',
    iconInlineStart: 'instagram' as keyof typeof Icon,
    style: 'socialLink',
    target: '_blank',
    text: '',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const ButtonPlay: StrictStory = {
  args: {
    ariaHasPopUp: false,
    ariaLabel: 'Video mit dem Titel die SAGW stellt sich vor laden und abspielen.',
    buttonType: 'button',
    colorTheme: 'light',
    element: 'button',
    iconInlineStart: 'play' as keyof typeof Icon,
    style: 'buttonPlay',
    text: '',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
