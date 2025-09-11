import type { Option } from '@payloadcms/ui/elements/ReactSelect/';

export type ThemeOption = Option & {
  colors: [string, string, string];
};

export const themes: ThemeOption[] = [
  {
    colors: [
      '#FF5733',
      '#FFBD33',
      '#C70039',
    ],
    label: 'Sunset',
    value: 'sunset',
  },
  {
    colors: [
      '#0077B6',
      '#00B4D8',
      '#90E0EF',
    ],
    label: 'Ocean',
    value: 'ocean',
  },
  {
    colors: [
      '#2D6A4F',
      '#40916C',
      '#95D5B2',
    ],
    label: 'Forest',
    value: 'forest',
  },
];
