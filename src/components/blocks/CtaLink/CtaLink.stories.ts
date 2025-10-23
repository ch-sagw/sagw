import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { CtaLink } from '@/components/blocks/CtaLink/CtaLink';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type CtaLinkProps = React.ComponentProps<typeof CtaLink>;

type StrictStory = StoryObj<typeof CtaLink> & {
  args: CtaLinkProps;
};

const meta: Meta<typeof CtaLink> = {
  args: {},
  component: CtaLink,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/CtaLink',
};

export default meta;

export const CtaInternalLink: StrictStory = {
  args: {
    blockType: 'ctaLinkBlock',
    linkInternal: {
      internalLink: 'detailPage/somePageid',
      linkText: simpleRteConfig('Internal Link Text (internal)'),
    },
    linkType: 'internal',
    text: simpleRteConfig('CTA Link Block Text (internal)'),
    title: simpleRteConfig('CTA Link Block Title (internal)'),

  },
};

export const CtaExternalLink: StrictStory = {
  args: {
    blockType: 'ctaLinkBlock',
    linkExternal: {
      externalLink: 'https://www.foo.bar',
      externalLinkText: simpleRteConfig('External Link Text (external)'),
    },
    linkType: 'external',
    text: simpleRteConfig('CTA Link Block Text (external)'),
    title: simpleRteConfig('CTA Link Block Title (external)'),

  },
};

export const CtaMailLink: StrictStory = {
  args: {
    blockType: 'ctaLinkBlock',
    linkExternal: {
      externalLink: 'https://www.foo.bar',
      externalLinkText: simpleRteConfig('External Link Text (external)'),
    },
    linkType: 'external',
    text: simpleRteConfig('CTA Link Block Text (external)'),
    title: simpleRteConfig('CTA Link Block Title (external)'),

  },
};
