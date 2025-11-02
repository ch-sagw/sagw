import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { ConsentBanner } from '@/components/global/ConsentBanner/ConsentBanner';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rte3ConsentBannerText } from '@/utilities/rteSampleContent';
import { DefaultOverlay } from '@/components/global/ConsentOverlay/ConsentOverlay.stories';

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
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Consent/ConsentBanner',
};

export default meta;

export const DefaultBanner: StrictStory = {
  args: {
    buttonAcceptAll: simpleRteConfig('Alle zulassen'),
    buttonCustomizeSelection: simpleRteConfig('Auswahl anpassen'),
    buttonDeclineAll: simpleRteConfig('Alle ablehnen'),
    overlay: DefaultOverlay.args,
    pageLanguage: 'de',
    text: rte3ConsentBannerText('6901e41a205ce36d381c77e2'),
    title: simpleRteConfig('Diese Webseite verwendet Cookies'),
    visible: true,
  },
};
