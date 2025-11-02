import React, { useEffect } from 'react';
import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import type { PartialStoryFn } from 'storybook/internal/types';
import { ConsentOverlay } from '@/components/global/ConsentOverlay/ConsentOverlay';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type ConsentOverlayProps = React.ComponentProps<typeof ConsentOverlay>;

type StrictStory = StoryObj<typeof ConsentOverlay> & {
  args: ConsentOverlayProps;
};

// Decorator to automatically open the dialog
const autoOpenDecorator = (Story: PartialStoryFn): React.ReactElement => {
  useEffect(() => {
    const findAndOpenDialog = (): void => {
      const dialog = document.querySelector('dialog[class*="consentWrapper"]') as HTMLDialogElement | null;

      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    };

    findAndOpenDialog();
    const timer = setTimeout(findAndOpenDialog, 100);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Story />
  );
};

const meta: Meta<typeof ConsentOverlay> = {
  args: {},
  component: ConsentOverlay,
  decorators: [
    defaultDecoratorNoPadding,
    autoOpenDecorator as never,
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Consent/ConsentOverlay',
};

export default meta;

export const DefaultOverlay: StrictStory = {
  args: {
    analyticsPerformance: {
      text: simpleRteConfig('Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.'),
      title: simpleRteConfig('Analytics und Performance'),
      toggleLabelOff: simpleRteConfig('Aus'),
      toggleLabelOn: simpleRteConfig('An'),
    },
    buttonAcceptAll: simpleRteConfig('Alle zulassen'),
    buttonAcceptSelection: simpleRteConfig('Auswahl zulassen'),
    externalContent: {
      text: simpleRteConfig('Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).'),
      title: simpleRteConfig('Externe Inhalte'),
      toggleLabelOff: simpleRteConfig('Aus'),
      toggleLabelOn: simpleRteConfig('An'),
    },
    necessaryCookies: {
      text: simpleRteConfig('Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Ohne sie ist nicht gewährleistet, dass die Website einwandfrei funktioniert.'),
      title: simpleRteConfig('Notwendige Cookies'),
      toggleLabel: simpleRteConfig('Immer an'),
    },
    pageLanguage: 'de',
    text: simpleRteConfig('Sie haben die volle Kontrolle über Ihre Privatsphäre und entscheiden selbst, welche Cookies wir verwenden dürfen und welche nicht.'),
    title: simpleRteConfig('Cookies Einstellungen'),
  },
};
