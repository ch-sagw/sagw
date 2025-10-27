import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Figure } from '@/components/blocks/Figure/Figure';
import { defaultDecorator } from '@/storybook-helpers';
import { ContentImageWide } from '@/components/base/Image/Image.stories';
import {
  captionRte1,
  creditsRte1,
} from '@/utilities/rteSampleContent';

type FigureProps = React.ComponentProps<typeof Figure>;

type StrictStory = StoryObj<typeof Figure> & {
  args: FigureProps;
};

const meta: Meta<typeof Figure> = {
  args: {},
  component: Figure,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Figure',
};

export default meta;

export const ContentImageCentered: StrictStory = {
  args: {
    alignment: 'centered',
    caption: captionRte1,
    credits: creditsRte1,
    imageConfig: ContentImageWide.args,
  },
};
