import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import React from 'react';
import { Image } from '@/payload-types';

type GenericTeaserProps = React.ComponentProps<typeof GenericTeaser>;

type StrictStory = StoryObj<typeof GenericTeaser> & {
  args: GenericTeaserProps;
};

const personImage: Image = {
  alt: 'Das Bild zeigt...',
  createdAt: '2025-11-19T09:54:49.430Z',
  filename: 'csm_Haller_Lea_web_cbe78041a2.jpg',
  focalX: 50,
  focalY: 50,
  height: 650,
  id: '6942d68d78d7d59f02b53782',
  updatedAt: '2025-11-19T09:54:49.431Z',
  // The url value coming from Payload will not contain the hostname.
  // It is added here for Storybook only.
  url: 'https://sagw-nu-localhost.gumlet.io/csm_Haller_Lea_web_cbe78041a2.jpg',
  width: 650,
};

const meta: Meta<typeof GenericTeaser> = {
  args: {},
  component: GenericTeaser,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
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
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Mehr erfahren',
        type: 'internal',
      },
    ],
    logo: 'some-logo.svg',
    texts: ['Die Forschungsstelle Dodis ist das unabhängige Kompetenzzentrum für die Geschichte der schweizerischen Aussenpolitik und der internationalen Beziehungen der Schweiz.'],
    title: 'Diplomatische Dokumente der Schweiz',
    type: 'institute',
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
    texts: ['Gründungsjahr: 1907'],
    title: 'Archäologie Schweiz',
    type: 'network',
  },
  render: customRender,
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
    texts: ['Ab 2021 hat die Akademie zudem die Förderzuständigkeit für acht längerfristige Editionen vom SNF übernommen.'],
    title: 'Plattform Ageing Society',
    type: 'project',
  },
  render: customRender,
};

export const Magazine: StrictStory = {
  args: {
    image: 'some-logo.jpg',
    links: [
      {
        href: 'https://www.foo.bar',
      },
    ],
    texts: ['Zur Kultur der Bookishness in der Erlebnisgesellschaft'],
    title: 'The Mobility Imperative in Academia',
    type: 'magazine',
  },
  render: customRender,
};

export const People: StrictStory = {
  args: {
    image: personImage,
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
    texts: [
      'Generalsekretärin in Co-Leitung',
      'Mitglied Geschäftsleitung',
    ],
    title: 'Dr. Lea Haller',
    type: 'people',
  },
  render: customRender,
};

export const Generic: StrictStory = {
  args: {
    image: 'some-image.jpg',
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Mehr erfahren',
        type: 'internal',
      },
    ],
    texts: ['Die Forschungsstelle Dodis ist das unabhängige Kompetenzzentrum für die Geschichte der schweizerischen Aussenpolitik und der internationalen Beziehungen der Schweiz.'],
    title: 'Diplomatische Dokumente der Schweiz',
    type: 'generic',
  },
  render: customRender,
};
