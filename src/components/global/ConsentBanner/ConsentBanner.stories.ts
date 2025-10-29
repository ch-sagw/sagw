import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { ConsentBanner } from '@/components/global/ConsentBanner/ConsentBanner';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rte3ConsentBannerText } from '@/utilities/rteSampleContent';

type ConsentBannerProps = React.ComponentProps<typeof ConsentBanner>;

type StrictStory = StoryObj<typeof ConsentBanner> & {
  args: ConsentBannerProps;
};

const meta: Meta<typeof ConsentBanner> = {
  args: {},
  component: ConsentBanner,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/ConsentBanner',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    buttonAcceptAll: simpleRteConfig('Alle zulassen'),
    buttonCustomizeSelection: simpleRteConfig('Alle ablehnen'),
    buttonDeclineAll: simpleRteConfig('Auswahl anpassen'),
    text: rte3ConsentBannerText,
    title: simpleRteConfig('Diese Webseite verwendet Cookies'),
  },
};
