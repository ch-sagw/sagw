import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Header } from '@/components/global/Header/Header';
import { defaultDecorator } from '@/storybook-helpers';
import { HeaderDark as NavigationHeader } from '@/components/base/Navigation/Navigation.stories';
import { Closed as MenuButton } from '@/components/base/MenuButton/MenuButton.stories';
import { InfoBlockDark } from '@/components/base/NavigationInfoBlock/NavigationInfoBlock.stories';
import { MetanavDark } from '@/components/base/Metanav/Metanav.stories';
import { LangNavDark } from '@/components/base/Langnav/Langnav.stories';

type HeaderProps = React.ComponentProps<typeof Header>;

type StrictStory = StoryObj<typeof Header> & {
  args: HeaderProps;
};

const meta: Meta<typeof Header> = {
  args: {},
  component: Header,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Header',
};

export default meta;

export const HeaderDark: StrictStory = {
  args: {
    colorMode: 'dark',
    langnav: LangNavDark.args,
    logoName: 'sagw',
    menuButton: MenuButton.args,
    metanav: MetanavDark.args,
    navigation: NavigationHeader.args,
    navigationInfoBlock: InfoBlockDark.args,
  },
};

export const HeaderLight: StrictStory = {
  args: {
    colorMode: 'light',
    langnav: LangNavDark.args,
    logoName: 'sagw',
    menuButton: MenuButton.args,
    metanav: MetanavDark.args,
    navigation: NavigationHeader.args,
    navigationInfoBlock: InfoBlockDark.args,
  },
};

export const HeaderWhite: StrictStory = {
  args: {
    colorMode: 'white',
    langnav: LangNavDark.args,
    logoName: 'sagw',
    menuButton: MenuButton.args,
    metanav: MetanavDark.args,
    navigation: NavigationHeader.args,
    navigationInfoBlock: InfoBlockDark.args,
  },
};
