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
});

const leadField: Field = rte1({
  name: 'lead',
  notRequired: true,
});

const dateField: Field = {
  name: 'date',
  required: true,
  type: 'date',
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
    rte1({
      name: 'sideTitle',
    }),
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
    rte1({
      name: 'author',
    }),
    dateField,
  ],
  interfaceName: 'InterfaceHeroFieldMagazineDetail',
  ...generalProps,
};

export const fieldsHeroNewsDetail: GroupField = {
  fields: [
    titleField,
    leadField,
    colorMode,
    dateField,
  ],
  interfaceName: 'InterfaceHeroFieldNewsDetail',
  ...generalProps,
};
