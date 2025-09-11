'use server';

import { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import { themes } from '@/components/admin/ThemeSelector/Themes';

import ThemeSelector from '@/components/admin/ThemeSelector/ThemeSelectorClient';

const InternalLinkChooser = (props: UIFieldServerProps): JSX.Element => {
  const {
    path,
  } = props;

  return (
    <ThemeSelector
      options={themes}
      path={path}
    />
  );
};

export default InternalLinkChooser;
