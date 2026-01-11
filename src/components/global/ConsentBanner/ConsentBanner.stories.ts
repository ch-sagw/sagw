import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { ConsentBanner } from '@/components/global/ConsentBanner/ConsentBanner';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

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
  tags: ['a11y:check'],
  title: 'Components/global/Consent/ConsentBanner',
};

export default meta;

export const DefaultBanner: StrictStory = {
  args: {
    buttonAcceptAll: simpleRteConfig('Alle zulassen'),
    buttonCustomizeSelection: simpleRteConfig('Auswahl anpassen'),
    buttonDeclineAll: simpleRteConfig('Alle ablehnen'),
    textHtml: 'Wir verwenden Cookies, um Ihnen ein optimales Erlebnis zu bieten. Besuchen Sie unsere <a href="#">Datenschutzrichtlinien</a> für weitere Details.',
    title: simpleRteConfig('Diese Webseite verwendet Cookies'),
  },
};
