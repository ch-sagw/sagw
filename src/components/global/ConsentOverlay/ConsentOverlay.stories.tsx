import React, { useEffect } from 'react';
import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import type { PartialStoryFn } from 'storybook/internal/types';
import {
  ConsentOverlayClient, type InterfaceConsentOverlayClientPropTypes,
} from '@/components/global/ConsentOverlay/ConsentOverlay.client';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof ConsentOverlayClient> & {
  args: InterfaceConsentOverlayClientPropTypes;
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

const meta: Meta<typeof ConsentOverlayClient> = {
  args: {},
  component: ConsentOverlayClient,
  decorators: [
    defaultDecoratorNoPadding,
    autoOpenDecorator as never,
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['a11y:check'],
  title: 'Components/global/Consent/ConsentOverlay',
};

export default meta;

export const DefaultOverlay: StrictStory = {
  args: {
    analyticsPerformance: {
      text: rteToHtml(simpleRteConfig('Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.')),
      textHtml: rteToHtml(simpleRteConfig('Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.')),
      title: rteToHtml(simpleRteConfig('Analytics und Performance')),
      titleHtml: rteToHtml(simpleRteConfig('Analytics und Performance')),
      toggleDefault: 'off',
      toggleLabelOff: rteToHtml(simpleRteConfig('Aus')),
      toggleLabelOffHtml: rteToHtml(simpleRteConfig('Aus')),
      toggleLabelOn: rteToHtml(simpleRteConfig('An')),
      toggleLabelOnHtml: rteToHtml(simpleRteConfig('An')),
    },
    buttonAcceptAll: rteToHtml(simpleRteConfig('Alle zulassen')),
    buttonAcceptSelection: rteToHtml(simpleRteConfig('Auswahl zulassen')),
    externalContent: {
      text: rteToHtml(simpleRteConfig('Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).')),
      textHtml: rteToHtml(simpleRteConfig('Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).')),
      title: rteToHtml(simpleRteConfig('Externe Inhalte')),
      titleHtml: rteToHtml(simpleRteConfig('Externe Inhalte')),
      toggleDefault: 'off',
      toggleLabelOff: rteToHtml(simpleRteConfig('Aus')),
      toggleLabelOffHtml: rteToHtml(simpleRteConfig('Aus')),
      toggleLabelOn: rteToHtml(simpleRteConfig('An')),
      toggleLabelOnHtml: rteToHtml(simpleRteConfig('An')),
    },
    necessaryCookies: {
      text: rteToHtml(simpleRteConfig('Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Ohne sie ist nicht gewährleistet, dass die Website einwandfrei funktioniert.')),
      textHtml: rteToHtml(simpleRteConfig('Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Ohne sie ist nicht gewährleistet, dass die Website einwandfrei funktioniert.')),
      title: rteToHtml(simpleRteConfig('Notwendige Cookies')),
      titleHtml: rteToHtml(simpleRteConfig('Notwendige Cookies')),
      toggleDefault: 'on',
      toggleLabel: rteToHtml(simpleRteConfig('Immer an')),
      toggleLabelHtml: rteToHtml(simpleRteConfig('Immer an')),
    },
    text: rteToHtml(simpleRteConfig('Sie haben die volle Kontrolle über Ihre Privatsphäre und entscheiden selbst, welche Cookies wir verwenden dürfen und welche nicht.')),
    title: rteToHtml(simpleRteConfig('Cookies Einstellungen')),
  },
};
