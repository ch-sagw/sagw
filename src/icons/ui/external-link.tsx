import React, { JSX } from 'react';

const svgData = {
  fill: 'none',
  paths: [
    {
      d: 'M12.8184 9.18177L21 1',
      strokeWidth: '1.5',
    },
    {
      d: 'M20.9994 7.54542L20.9984 1.00102L14.4541 1',
      strokeLinecap: 'square' as const,
      strokeWidth: '1.5',
    },
    {
      d: 'M17.727 10.8181V18.1817C17.727 18.3987 17.727 18.9999 17.727 18.9999C17.727 18.9999 17.1258 18.9999 16.9089 18.9999H3.81817C3.60118 18.9999 3 18.9999 3 18.9999C3 18.9999 3 18.3987 3 18.1817V5.09088C3 4.87389 3 4.27271 3 4.27271C3 4.27271 3.60118 4.27271 3.81817 4.27271H11.1817',
      strokeWidth: '1.5',
    },
  ],
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
};

// Generate string version of SVG. Used in RTE component.
export const externalLink = `<svg role='presentation' viewBox="${svgData.viewBox}" fill="${svgData.fill}" xmlns="${svgData.xmlns}">${svgData.paths.map((path) => `<path ${Object.entries(path)
  .map(([
    key,
    value,
  ]) => `${key}="${value}"`)
  .join(' ')} />`)
  .join('')}</svg>`;

// Generate React component. Used in Icon component.
const icon = (): JSX.Element => (
  <svg role='presentation' viewBox={svgData.viewBox} fill={svgData.fill} xmlns={svgData.xmlns}>
    {svgData.paths.map((path, index) => (
      <path key={index} {...path} />
    ))}
  </svg>
);

export default icon;
