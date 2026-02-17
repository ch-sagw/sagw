import {
  Field, GroupField,
} from 'payload';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { fieldAccessHeroAnimation } from '@/access/fields/hero';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

const colorModeOverview = fieldsColorMode({
  dark: true,
  defaultColor: 'light',
  light: true,
  white: true,
});

const colorModeDetail = fieldsColorMode({
  dark: true,
  defaultColor: 'white',
  light: true,
  white: true,
});

const titleField = rte2({
  name: 'title',
});

const leadField: Field = rte2({
  name: 'lead',
  notRequired: true,
});

const dateField: Field = {
  access: fieldAccessNonLocalizableField,
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

export const fieldsHero = (isOverview?: boolean): GroupField => ({
  fields: [
    titleField,
    leadField,
    isOverview
      ? colorModeOverview
      : colorModeDetail,
  ],
  interfaceName: 'InterfaceHeroField',
  ...generalProps,
});

export const fieldsHeroHome: GroupField = {
  fields: [
    titleField,
    leadField,
    rte1({
      name: 'sideTitle',
    }),
    fieldsLinkInternalWithToggle({
      adminDescription: 'This is the text behind which the link is hidden.',
    }),
    {
      access: fieldAccessHeroAnimation,
      defaultValue: true,
      name: 'animated',
      type: 'checkbox',
    },
  ],
  interfaceName: 'InterfaceHeroFieldHome',
  ...generalProps,
};

export const fieldsHeroMagazineDetail: GroupField = {
  fields: [
    titleField,
    leadField,
    rte1({
      name: 'author',
    }),
    dateField,
    colorModeDetail,
  ],
  interfaceName: 'InterfaceHeroFieldMagazineDetail',
  ...generalProps,
};

export const fieldsHeroNewsDetail: GroupField = {
  fields: [
    titleField,
    leadField,
    dateField,
    colorModeDetail,
  ],
  interfaceName: 'InterfaceHeroFieldNewsDetail',
  ...generalProps,
};
