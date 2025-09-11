export interface InterfaceThemeOption {
  label: string;
  value: string;
  colors: [string, string, string];
  image: string;
}

export const themes: InterfaceThemeOption[] = [
  {
    colors: [
      '#FF5733',
      '#FFBD33',
      '#C70039',
    ],
    image: '/theme-preview/sunset.png',
    label: 'Sunset',
    value: 'sunset',
  },
  {
    colors: [
      '#0077B6',
      '#00B4D8',
      '#90E0EF',
    ],
    image: '/theme-preview/ocean.png',
    label: 'Ocean',
    value: 'ocean',
  },
];
