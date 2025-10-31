import React, { JSX } from 'react';

const svgData = {
  fill: 'none',
  paths: [
    {
      d: 'M1 8L16 8',
      strokeWidth: '1.5',
    },
    {
      d: 'M11.5 3.5L16 8L11.5 12.5',
      strokeLinecap: 'square' as const,
      strokeWidth: '1.5',
    },
  ],
  viewBox: '0 0 18 16',
  xmlns: 'http://www.w3.org/2000/svg',
};

// Generate string version of SVG. Used in RTE component.
export const arrowRight = `<svg viewBox="${svgData.viewBox}" fill="${svgData.fill}" xmlns="${svgData.xmlns}">${svgData.paths.map((path) => `<path ${Object.entries(path)
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

