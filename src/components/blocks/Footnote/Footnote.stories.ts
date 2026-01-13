import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  FootnoteClient, type InterfaceFootnoteClientPropTypes,
} from '@/components/blocks/Footnote/Footnote.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof FootnoteClient> & {
  args: InterfaceFootnoteClientPropTypes;
};

const meta: Meta<typeof FootnoteClient> = {
  args: {},
  component: FootnoteClient,
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
    textHtml: 'This is the footnote text content. It can contain multiple paragraphs and links.',
    titleHtml: rteToHtml(simpleRteConfig('Footnote Title')),
  },
};
