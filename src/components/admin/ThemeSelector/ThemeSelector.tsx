'use server';

import { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';

import ThemeSelector from './ThemeSelectorClient';

const options: Option[] = [
  {
    label: 'foo',
    value: 'bar',
  },
];

const InternalLinkChooser = (props: UIFieldServerProps): JSX.Element => {
  const {
    path,
  } = props;

  return (
    <ThemeSelector
      options={options}
      path={path}
    />
  );
};

export default InternalLinkChooser;
