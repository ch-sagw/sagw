import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  type InterfaceRteClientPropTypes, RteClient,
} from '@/components/blocks/Rte/Rte.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte4FullRangeStartingParagraph } from '@/utilities/rteSampleContent';

type StrictStory = StoryObj<typeof RteClient> & {
  args: InterfaceRteClientPropTypes;
};

const meta: Meta<typeof RteClient> = {
  args: {},
  component: RteClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Rte',
};

export default meta;

export const Light: StrictStory = {
  args: {
    colorMode: 'light',
    stickyFirstTitle: false,
    textHtml: rteToHtml(simpleRteConfig('<p>This is a sample RTE content in light mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};

export const Dark: StrictStory = {
  args: {
    colorMode: 'dark',
    stickyFirstTitle: false,
    textHtml: rteToHtml(simpleRteConfig('<p>This is a sample RTE content in dark mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};

export const White: StrictStory = {
  args: {
    colorMode: 'white',
    stickyFirstTitle: false,
    textHtml: rteToHtml(simpleRteConfig('<p>This is a sample RTE content in white mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};

export const RteWhiteWithoutTitle: StrictStory = {
  args: {
    colorMode: 'white',
    stickyFirstTitle: true,
    textHtml: rteToHtml(rte4FullRangeStartingParagraph),
  },
};

export const WithStickyFirstTitle: StrictStory = {
  args: {
    colorMode: 'light',
    stickyFirstTitle: true,
    textHtml: rteToHtml(simpleRteConfig('<h2>Some title</h2><p>This is a sample RTE content in white mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};
