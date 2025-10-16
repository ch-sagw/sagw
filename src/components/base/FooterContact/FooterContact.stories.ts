import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FooterContact } from '@/components/base/FooterContact/FooterContact';
import { defaultDecorator } from '@/storybook-helpers';

type FooterContactProps = React.ComponentProps<typeof FooterContact>;

type StrictStory = StoryObj<typeof FooterContact> & {
  args: FooterContactProps;
};

const meta: Meta<typeof FooterContact> = {
  args: {},
  component: FooterContact,
  decorators: [defaultDecorator],
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Footer/FooterContact',
};

export default meta;

export const FullContact: StrictStory = {
  args: {
    address1: {
      plain: 'Haus der Akademien',
      rte: 'Haus der Akademien',
    },
    address2: {
      plain: 'Laupenstrasse 7',
      rte: 'Laupenstrasse 7',
    },
    city: 'Bern',
    countryCode: 'CH',
    imageUrl: 'https://sagw.ch/logo.svg',
    mail: 'sagw@sagw.ch',
    phone: '+41 31 306 92 50',
    poBox: 'Postfach',
    title: {
      plain: 'SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften',
      rte: 'SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften',
    },
    url: 'https://www.sagw.ch',
    zip: '3001',
  },
};

export const MinimalContact: StrictStory = {
  args: {
    address1: {
      plain: 'Haus der Akademien',
      rte: 'Haus der Akademien',
    },
    city: 'Bern',
    countryCode: 'CH',
    imageUrl: 'https://sagw.ch/logo.svg',
    title: {
      plain: 'SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften',
      rte: 'SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften',
    },
    url: 'https://www.sagw.ch',
    zip: '3001',
  },
};
