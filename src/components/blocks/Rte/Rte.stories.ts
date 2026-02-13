import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  type InterfaceRteClientPropTypes, RteClient,
} from '@/components/blocks/Rte/Rte.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof RteClient> & {
  args: InterfaceRteClientPropTypes;
};

const meta: Meta<typeof RteClient> = {
  args: {},
  component: RteClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Rte',
};

export default meta;

export const Light: StrictStory = {
  args: {
    colorMode: 'light',
    stickyFirstTitle: false,
    textHtml: rteToHtml(simpleRteConfig('<p>This is a sample RTE content in light mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};

export const Dark: StrictStory = {
  args: {
    colorMode: 'dark',
    stickyFirstTitle: false,
    textHtml: rteToHtml(simpleRteConfig('<p>This is a sample RTE content in dark mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};

export const White: StrictStory = {
  args: {
    colorMode: 'white',
    stickyFirstTitle: false,
    textHtml: rteToHtml(simpleRteConfig('<p>This is a sample RTE content in white mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};

export const RteWhiteWithoutTitle: StrictStory = {
  args: {
    colorMode: 'white',
    stickyFirstTitle: true,
    textHtml: rteToHtml(simpleRteConfig('<p>Um dem in der Regel internationalen Tätigkeitsfeld der Forscher·innen gerecht zu werden, heisst der einstige Nachwuchspreis der SAGW neu Early Career Award. Stéphanie Soubrier (Universität Genf), Madeline Woker (Collegium Helveticum / University of Sheffield) und Magdalena Breyer (Universität Basel) überzeugten die Jury in diesem Jahr durch die hohe Qualität ihrer wissenschaftlichen Arbeit.</p><h3>Erster Preis: Ein Schlaglicht auf die&nbsp;<strong>«Boys» an Bord der französischen Dampfschiffe</strong></h3><p>Um dem in der Regel internationalen Tätigkeitsfeld der Forscher·innen gerecht zu werden, heisst der einstige Nachwuchspreis der SAGW neu Early Career Award. Stéphanie Soubrier (Universität Genf), Madeline Woker (Collegium Helveticum / University of Sheffield) und Magdalena Breyer (Universität Basel) überzeugten die Jury in diesem Jahr durch die hohe Qualität ihrer wissenschaftlichen Arbeit.</p><p>Um dem in der Regel internationalen Tätigkeitsfeld der Forscher·innen gerecht zu werden, heisst der einstige Nachwuchspreis der SAGW neu Early Career Award. Stéphanie Soubrier (Universität Genf), Madeline Woker (Collegium Helveticum / University of Sheffield) und Magdalena Breyer (Universität Basel) überzeugten die Jury in diesem Jahr durch die hohe Qualität ihrer wissenschaftlichen Arbeit.</p><ul class="list-bullet"><li>Um dem in der Regel internationalen Tätigkeitsfeld</li><li>der Forscher·innen gerecht zu werden, heisst der einstige Nachwuchspreis </li><li>der SAGW neu Early Career Award. Stéphanie Soubrier (Universität Genf), </li><li>Madeline Woker (Collegium Helveticum / University of Sheffield) und Magdalena Breyer (Universität Basel) überzeugten die Jury in diesem Jahr durch die hohe Qualität ihrer wissenschaftlichen Arbeit.</li></ul><p>Um dem in der Regel internationalen Tätigkeitsfeld der Forscher·innen gerecht zu werden, heisst der einstige Nachwuchspreis der SAGW neu Early Career Award. Stéphanie Soubrier (Universität Genf), Madeline Woker (Collegium Helveticum / University of Sheffield) und Magdalena Breyer (Universität Basel) überzeugten die Jury in diesem Jahr durch die hohe Qualität ihrer wissenschaftlichen Arbeit.</p>')),
  },
};

export const WithStickyFirstTitle: StrictStory = {
  args: {
    colorMode: 'light',
    stickyFirstTitle: true,
    textHtml: rteToHtml(simpleRteConfig('<h2>Some title</h2><p>This is a sample RTE content in white mode. It can contain <strong>rich text</strong> and <a href="#">links</a>.</p>')),
  },
};
