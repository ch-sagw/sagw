import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import React from 'react';

type GenericTeaserProps = React.ComponentProps<typeof GenericTeaser>;

type StrictStory = StoryObj<typeof GenericTeaser> & {
  args: GenericTeaserProps;
};

const meta: Meta<typeof GenericTeaser> = {
  args: {},
  component: GenericTeaser,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/GenericTeaser',
};

const customRender = (args: GenericTeaserProps): React.JSX.Element => (
  <div style={{
    maxWidth: '570px',
  }}>
    <GenericTeaser {...args} />
  </div>
);

export default meta;

export const Institute: StrictStory = {
  args: {
    border: true,
    linkIconNeutralColor: true,
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Mehr erfahren',
        type: 'internal',
      },
    ],
    logo: 'some-logo.svg',
    pageLanguage: 'de',
    texts: ['Die Forschungsstelle Dodis ist das unabhängige Kompetenzzentrum für die Geschichte der schweizerischen Aussenpolitik und der internationalen Beziehungen der Schweiz.'],
    title: 'Diplomatische Dokumente der Schweiz',
  },
  render: customRender,
};

export const Network: StrictStory = {
  args: {
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Zur Website',
        type: 'external',
      },
    ],
    logo: 'some-logo.svg',
    pageLanguage: 'de',
    texts: ['Gründungsjahr: 1907'],
    title: 'Archäologie Schweiz',
  },
};

export const Project: StrictStory = {
  args: {
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Zum Projekt',
        type: 'internal',
      },
    ],
    pageLanguage: 'de',
    texts: ['Ab 2021 hat die Akademie zudem die Förderzuständigkeit für acht längerfristige Editionen vom SNF übernommen.'],
    title: 'Plattform Ageing Society',
  },
};

export const Magazine: StrictStory = {
  args: {
    image: 'some-logo.jpg',
    links: [
      {
        href: 'https://www.foo.bar',
      },
    ],
    pageLanguage: 'de',
    texts: ['Zur Kultur der Bookishness in der Erlebnisgesellschaft'],
    title: 'The Mobility Imperative in Academia',
  },
};

export const People: StrictStory = {
  args: {
    image: 'some-logo.jpg',
    links: [
      {
        href: 'tel:+41310001122',
        text: '+41 (0)31 000 11 22',
        type: 'phone',
      },
      {
        href: 'mailto:lea.haller@sagw.ch',
        text: 'lea.haller@sagw.ch',
        type: 'mail',
      },
    ],
    pageLanguage: 'de',
    texts: [
      'Generalsekretärin in Co-Leitung',
      'Mitglied Geschäftsleitung',
    ],
    title: 'Dr. Lea Haller',
  },
};
