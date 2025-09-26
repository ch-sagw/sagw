import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Header } from '@/components/global/Header/Header';
import { defaultDecorator } from '@/storybook-helpers';
import { Header as NavigationHeader } from '@/components/base/Navigation/Navigation.stories';
import { Closed as MenuButton } from '@/components/base/MenuButton/MenuButton.stories';
import { DefaultInfoBlock } from '@/components/base/NavigationInfoBlock/NavigationInfoBlock.stories';
import { DefaultMetanav } from '@/components/base/Metanav/Metanav.stories';
import { DefaultLangNav } from '@/components/base/Langnav/Langnav.stories';

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

export const DefaultHeader: StrictStory = {
  args: {
    langnav: DefaultLangNav.args,
    logoName: 'sagw',
    menuButton: MenuButton.args,
    metanav: DefaultMetanav.args,
    navigation: NavigationHeader.args,
    navigationInfoBlock: DefaultInfoBlock.args,
  },
};
