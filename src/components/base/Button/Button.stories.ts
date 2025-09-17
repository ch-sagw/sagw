import type {
  ArgTypes,
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Button } from '@/components/base/Button/Button';
import { defaultDecorator } from '@/storybook-helpers';

type ButtonProps = React.ComponentProps<typeof Button>;

type StrictStory = StoryObj<typeof Button> & {
  args: ButtonProps;
};

const argTypes: Partial<ArgTypes<ButtonProps>> = {
  colorTheme: {
    control: {
      type: 'radio',
    },
    options: [
      'light',
      'dark',
    ],
  },
  iconInlineEnd: {
    control: {
      type: 'text',
    },
  },
  iconInlineStart: {
    control: {
      type: 'text',
    },
  },
  style: {
    control: {
      type: 'radio',
    },
    options: [
      'filled',
      'outlined',
      'text',
    ],
  },
  target: {
    control: {
      type: 'radio',
    },
    options: [
      '_self',
      '_blank',
    ],
  },
  type: {
    control: {
      type: 'select',
    },
    options: [
      'button',
      'reset',
      'submit',
      'link',
    ],
  },
};

const meta: Meta<typeof Button> = {
  argTypes,
  args: {},
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
    iconInlineEnd: '',
    iconInlineStart: '',
    style: 'filled',
    text: 'Sample Button text',
    type: 'button',
  },
};

export const ButtonPrimaryFilledDark: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'dark',
    iconInlineEnd: '',
    iconInlineStart: '',
    style: 'filled',
    text: 'Sample Button text',
    type: 'button',
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
    iconInlineEnd: '',
    iconInlineStart: 'menu',
    style: 'filled',
    text: 'Sample Button text',
    type: 'button',
  },
};

export const ButtonPrimaryFilledIconStartDark: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'dark',
    iconInlineEnd: '',
    iconInlineStart: 'menu',
    style: 'filled',
    text: 'Sample Button text',
    type: 'button',
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
    iconInlineEnd: '',
    iconInlineStart: 'menu',
    style: 'outlined',
    text: 'Sample Button text',
    type: 'button',
  },
};

export const ButtonPrimaryOutlinedDark: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'dark',
    iconInlineEnd: '',
    iconInlineStart: 'menu',
    style: 'outlined',
    text: 'Sample Button text',
    type: 'button',
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
    iconInlineEnd: '',
    iconInlineStart: 'menu',
    style: 'text',
    text: 'Sample Button text',
    type: 'button',
  },
};

export const ButtonLinkPrimaryFilled: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    href: 'https://www.sagw.ch.com',
    style: 'filled',
    target: '_blank',
    text: 'Sample Button text',
    type: 'link',
  },
};

export const ButtonLinkPrimaryOutlined: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    href: 'https://www.sagw.ch.com',
    style: 'outlined',
    target: '_blank',
    text: 'Sample Button text',
    type: 'link',
  },
};

export const ButtonLinkText: StrictStory = {
  args: {
    ariaHasPopUp: false,
    colorTheme: 'light',
    href: 'https://www.sagw.ch.com',
    style: 'text',
    target: '_blank',
    text: 'Sample Button text',
    type: 'link',
  },
};

