import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  BibliographicReferenceClient, type InterfaceBibliographicReferenceClientPropTypes,
} from '@/components/blocks/BibliographicReference/BibliographicReference.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof BibliographicReferenceClient> & {
  args: InterfaceBibliographicReferenceClientPropTypes;
};

const meta: Meta<typeof BibliographicReferenceClient> = {
  args: {},
  component: BibliographicReferenceClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/BibliographicReference',
};

export default meta;

export const SampleReference: StrictStory = {
  args: {
    buttonText: simpleRteConfig('Kopieren'),
    textHtml: 'Die schulische Ganztagesbetreuung ist in der Schweiz ein viel diskutiertes Thema, sowohl in der Politik als auch in der Gesellschaft. Trotz ihrer zunehmenden Bedeutung ist die Verbreitung von Ganztagesschulen in den Kantonen und Gemeinden sehr unterschiedlich. Die Studie untersucht die Einstellungen von Eltern zu diesem Thema und liefert differenzierte Einblicke in regionale Unterschiede, Beweggründe und soziodemografische Faktoren. Die Studie bietet dadurch wichtige Anhaltspunkte für die Bildungspolitik und zeigt, wie vielfältig die Bedürfnisse und Erwartungen von Eltern in der Schweiz sind.',
    titleHtml: rteToHtml(simpleRteConfig('Bibliographic Reference')),
  },
};
