import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Footnote } from '@/components/blocks/Footnote/Footnote';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { sampleFootnoteContent } from '@/utilities/rteSampleContent';

type FootnoteProps = React.ComponentProps<typeof Footnote>;

type StrictStory = StoryObj<typeof Footnote> & {
  args: FootnoteProps;
};

const meta: Meta<typeof Footnote> = {
  args: {},
  component: Footnote,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Footnote',
};

export default meta;

export const SampleFootnote: StrictStory = {
  args: {
    blockType: 'footnoteBlock',
    text: sampleFootnoteContent,
    title: simpleRteConfig('Footnote title'),
  },
};
