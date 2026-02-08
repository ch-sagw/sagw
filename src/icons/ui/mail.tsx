import React, { JSX } from 'react';

const svgData = {
  fill: 'none',
  paths: [
    {
      d: 'M3.00011 5.25H21.0001V18C21.0001 18.1989 21.0001 18.75 21.0001 18.75C21.0001 18.75 20.449 18.75 20.2501 18.75H3.75011C3.5512 18.75 3.00011 18.75 3.00011 18.75C3.00011 18.75 3.00011 18.1989 3.00011 18V5.25Z',
      strokeLinecap: 'round' as const,
      strokeWidth: '1.5',
    },
    {
      d: 'M21 5.25L12 13.5L3 5.25',
      strokeLinecap: 'round' as const,
      strokeWidth: '1.5',
    },
  ],
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
};

// Generate string version of SVG. Used in RTE component.
export const mail = `<svg viewBox="${svgData.viewBox}" fill="${svgData.fill}" xmlns="${svgData.xmlns}">${svgData.paths.map((path) => `<path ${Object.entries(path)
  .map(([
    key,
    value,
  ]) => `${key}="${value}"`)
  .join(' ')} />`)
  .join('')}</svg>`;

const icon = (): JSX.Element => (
  <svg viewBox={svgData.viewBox} fill={svgData.fill} xmlns={svgData.xmlns}>
    {svgData.paths.map((path, index) => (
      <path key={index} {...path} />
    ))}
  </svg>
);

export default icon;
