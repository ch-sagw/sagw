import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { MenuButton } from '@/components/base/MenuButton/MenuButton';
import { defaultDecorator } from '@/storybook-helpers';

type MenuButtonProps = React.ComponentProps<typeof MenuButton>;

type StrictStory = StoryObj<typeof MenuButton> & {
  args: MenuButtonProps;
};

const meta: Meta<typeof MenuButton> = {
  args: {},
  component: MenuButton,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/MenuButton',
};

export default meta;

export const Open: StrictStory = {
  args: {
    colorMode: 'dark',
    hiddenTexts: {
      closeMenu: 'Menu schliessen',
      openMenu: 'Menu öffnen',
    },
    onClick: () => {
      console.log('some click handler');
    },
    open: true,
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const Closed: StrictStory = {
  args: {
    colorMode: 'dark',
    hiddenTexts: {
      closeMenu: 'Menu schliessen',
      openMenu: 'Menu öffnen',
    },
    onClick: () => {
      console.log('some click handler');
    },
    open: false,
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const Light: StrictStory = {
  args: {
    colorMode: 'light',
    hiddenTexts: {
      closeMenu: 'Menu schliessen',
      openMenu: 'Menu öffnen',
    },
    onClick: () => {
      console.log('some click handler');
    },
    open: false,
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const White: StrictStory = {
  args: {
    colorMode: 'white',
    hiddenTexts: {
      closeMenu: 'Menu schliessen',
      openMenu: 'Menu öffnen',
    },
    onClick: () => {
      console.log('some click handler');
    },
    open: false,
  },
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
};
