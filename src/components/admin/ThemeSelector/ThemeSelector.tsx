'use server';

import { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import { themes } from '@/components/admin/ThemeSelector/Themes';

import ThemeSelector from '@/components/admin/ThemeSelector/ThemeSelectorClient';

/* eslint-disable require-await */
const ThemeSelectorComponent = async (props: UIFieldServerProps): Promise<JSX.Element> => {
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
/* eslint-enable require-await */

export default ThemeSelectorComponent;
