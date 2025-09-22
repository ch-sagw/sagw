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
    hiddenTexts: {
      closeMenu: 'Menu schliessen',
      openMenu: 'Menu öffnen',
    },
    onClick: () => {
      console.log('some click handler');
    },
    open: true,
  },
};

export const Closed: StrictStory = {
  args: {
    hiddenTexts: {
      closeMenu: 'Menu schliessen',
      openMenu: 'Menu öffnen',
    },
    onClick: () => {
      console.log('some click handler');
    },
    open: false,
  },
};
