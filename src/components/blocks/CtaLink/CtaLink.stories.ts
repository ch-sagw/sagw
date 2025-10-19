import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { CtaLink } from '@/components/blocks/CtaLink/CtaLink';
import { defaultDecorator } from '@/storybook-helpers';

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
    colorMode: 'dark',
    link: {
      href: 'https://foo.bar',
      target: '_self',
      text: 'Förderung beantragen',
    },
    text: 'Jetzt Antrag für Reisebeiträge auf mySAGW stellen',
    title: 'Förderung',
  },
};

export const CtaExternalLink: StrictStory = {
  args: {
    colorMode: 'dark',
    link: {
      href: 'https://foo.bar',
      target: '_blank',
      text: 'Förderung beantragen',
    },
    text: 'Jetzt Antrag für Reisebeiträge auf mySAGW stellen',
    title: 'Förderung',
  },
};
