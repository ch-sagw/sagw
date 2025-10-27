import React, { JSX } from 'react';

const svgData = {
  fill: 'none',
  paths: [
    {
      d: 'M9 7.5L14 2.5',
      strokeWidth: '1.5',
    },
    {
      d: 'M14 6.5L13.9994 2.50062L10 2.5',
      strokeLinecap: 'square' as const,
      strokeWidth: '1.5',
    },
    {
      d: 'M12 8.5V13C12 13.1326 12 13.5 12 13.5C12 13.5 11.6326 13.5 11.5 13.5H3.5C3.36739 13.5 3 13.5 3 13.5C3 13.5 3 13.1326 3 13V5C3 4.86739 3 4.5 3 4.5C3 4.5 3.36739 4.5 3.5 4.5H8',
      strokeWidth: '1.5',
    },
  ],
  viewBox: '0 0 17 16',
  xmlns: 'http://www.w3.org/2000/svg',
};

// Generate string version of SVG. Used in RTE component.
export const externalLink = `<svg viewBox="${svgData.viewBox}" fill="${svgData.fill}" xmlns="${svgData.xmlns}">${svgData.paths.map((path) => `<path ${Object.entries(path)
  .map(([
    key,
    value,
  ]) => `${key}="${value}"`)
  .join(' ')} />`)
  .join('')}</svg>`;

// Generate React component. Used in Icon component.
const icon = (): JSX.Element => (
  <svg viewBox={svgData.viewBox} fill={svgData.fill} xmlns={svgData.xmlns}>
    {svgData.paths.map((path, index) => (
      <path key={index} {...path} />
    ))}
  </svg>
);

export default icon;
