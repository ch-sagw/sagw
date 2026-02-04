import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import React from 'react';
import {
  InstitutesTeaserImagePNG,
  InstitutesTeaserImageSVG,
  MagazineTeaserImage,
  NetworkTeaserImagePNG,
  NetworkTeaserImageSVG,
  PersonImage,
} from '@/components/blocks/helpers/imagesData';

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
  ],
  title: 'Components/base/GenericTeaser',
};

const customRender = (args: GenericTeaserProps): React.JSX.Element => (
  <div style={{
    maxWidth: '571px',
  }}>
    <GenericTeaser {...args} />
  </div>
);

export default meta;

export const InstitutePNGLogo: StrictStory = {
  args: {
    image: InstitutesTeaserImagePNG,
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Mehr erfahren',
        type: 'internal',
      },
    ],
    texts: ['Das Institut des Dicziunari Rumantsch Grischun mit Sitz in Chur ist Herausgeberin des grössten bündnerromanischen Wörterbuches. Es enthält den gesamten seit dem 16. Jahrhundert bis heute dokumentierten Wortschatz aller Idiome und Dialekte, eingeschlossen der gesprochenen Sprache.'],
    title: 'Dicziunari Rumantsch Grischun',
    type: 'institute',
  },
  render: customRender,
};

export const InstituteSVGLogo: StrictStory = {
  args: {
    image: InstitutesTeaserImageSVG,
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Mehr erfahren',
        type: 'internal',
      },
    ],
    texts: ['Das Institut des Dicziunari Rumantsch Grischun mit Sitz in Chur ist Herausgeberin des grössten bündnerromanischen Wörterbuches. Es enthält den gesamten seit dem 16. Jahrhundert bis heute dokumentierten Wortschatz aller Idiome und Dialekte, eingeschlossen der gesprochenen Sprache.'],
    title: 'Dicziunari Rumantsch Grischun',
    type: 'institute',
  },
  render: customRender,
};

export const NetworkPNGLogo: StrictStory = {
  args: {
    image: NetworkTeaserImagePNG,
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Zur Website',
        type: 'external',
      },
    ],
    texts: ['Gründungsjahr: 1983'],
    title: 'Schweizerische Gesellschaft für Lateinamerikastudien',
    type: 'network',
  },
  render: customRender,
};

export const NetworkSVGLogo: StrictStory = {
  args: {
    image: NetworkTeaserImageSVG,
    links: [
      {
        href: 'https://www.foo.bar',
        text: 'Zur Website',
        type: 'external',
      },
    ],
    texts: ['Gründungsjahr: 1983'],
    title: 'Schweizerische Gesellschaft für Lateinamerikastudien',
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
    image: MagazineTeaserImage,
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
    image: PersonImage,
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
    image: MagazineTeaserImage,
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
