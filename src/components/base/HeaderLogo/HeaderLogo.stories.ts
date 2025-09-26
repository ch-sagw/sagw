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

export const LogoSagw: StrictStory = {
  args: {
    name: 'sagw',
  },
};
