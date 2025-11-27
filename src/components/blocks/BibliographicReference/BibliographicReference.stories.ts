import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { BibliographicReference } from '@/components/blocks/BibliographicReference/BibliographicReference';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type BibliographicReferenceProps = React.ComponentProps<typeof BibliographicReference>;

type StrictStory = StoryObj<typeof BibliographicReference> & {
  args: BibliographicReferenceProps;
};

const meta: Meta<typeof BibliographicReference> = {
  args: {},
  component: BibliographicReference,
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
    blockType: 'bibliographicReferenceBlock',
    buttonText: simpleRteConfig('Kopieren'),
    text: simpleRteConfig('Die schulische Ganztagesbetreuung ist in der Schweiz ein viel diskutiertes Thema, sowohl in der Politik als auch in der Gesellschaft. Trotz ihrer zunehmenden Bedeutung ist die Verbreitung von Ganztagesschulen in den Kantonen und Gemeinden sehr unterschiedlich. Die Studie untersucht die Einstellungen von Eltern zu diesem Thema und liefert differenzierte Einblicke in regionale Unterschiede, Beweggründe und soziodemografische Faktoren. Die Studie bietet dadurch wichtige Anhaltspunkte für die Bildungspolitik und zeigt, wie vielfältig die Bedürfnisse und Erwartungen von Eltern in der Schweiz sind.'),
    title: simpleRteConfig('Bibliographic Reference'),
  },
};
