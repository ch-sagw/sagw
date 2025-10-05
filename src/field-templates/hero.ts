import {
  Field, GroupField,
} from 'payload';
import { rte1 } from '@/field-templates/rte';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';

const colorMode = fieldsColorMode({
  dark: true,
  light: true,
  white: true,
});

const titleField = rte1({
  name: 'title',
  required: true,
});

const leadField: Field = {
  localized: true,
  name: 'lead',
  required: false,
  type: 'text',
};

const generalProps: {
  label: string;
  name: string;
  type: 'group';
} = {
  label: 'Hero',
  name: 'hero',
  type: 'group',
};

export const fieldsHero: GroupField = {
  fields: [
    titleField,
    leadField,
    colorMode,
  ],
  interfaceName: 'InterfaceHeroField',
  ...generalProps,
};

export const fieldsHeroHome: GroupField = {
  fields: [
    titleField,
    leadField,
    {
      // TODO: enable for SAGW only
      defaultValue: true,
      name: 'animated',
      type: 'checkbox',
    },
    {
      localized: true,
      name: 'sideTitle',
      required: true,
      type: 'text',
    },
    fieldsLinkInternalWithToggle,
  ],
  interfaceName: 'InterfaceHeroFieldHome',
  ...generalProps,
};

export const fieldsHeroMagazineDetail: GroupField = {
  fields: [
    titleField,
    leadField,
    colorMode,
    {
      localized: true,
      name: 'author',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'date',
      required: true,
      type: 'date',
    },
  ],
  interfaceName: 'InterfaceHeroFieldMagazineDetail',
  ...generalProps,
};

export const fieldsHeroNewsDetail: GroupField = {
  fields: [
    titleField,
    leadField,
    colorMode,
    {
      name: 'date',
      required: true,
      type: 'date',
    },
  ],
  interfaceName: 'InterfaceHeroFieldNewsDetail',
  ...generalProps,
};
