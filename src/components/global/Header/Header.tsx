// TODO
// - hidden text from navigationInfoBlock

import React from 'react';
import styles from '@/components/global/Header/Header.module.scss';
import {
  InterfaceNavigationPropTypes, Navigation,
} from '@/components/base/Navigation/Navigation';
import {
  InterfaceMenuButtonPropTypes, MenuButton,
} from '@/components/base/MenuButton/MenuButton';
import {
  InterfaceNavigationInfoBlockPropTypes, NavigationInfoBlock,
} from '@/components/base/NavigationInfoBlock/NavigationInfoBlock';
import {
  InterfaceMetanavPropTypes, Metanav,
} from '@/components/base/Metanav/Metanav';
import {
  InterfaceLangnavPropTypes, Langnav,
} from '@/components/base/Langnav/Langnav';
import { ColorMode } from '@/components/base/types/colorMode';

import { HeaderLogo } from '@/components/base/HeaderLogo/HeaderLogo';

export type InterfaceHeaderPropTypes = {
  navigation: InterfaceNavigationPropTypes;
  menuButton: InterfaceMenuButtonPropTypes;
  navigationInfoBlock: InterfaceNavigationInfoBlockPropTypes;
  metanav: InterfaceMetanavPropTypes;
  langnav: InterfaceLangnavPropTypes;
  logoName: 'sagw';
  colorMode: ColorMode;
};

export const Header = ({
  navigation,
  menuButton,
  navigationInfoBlock,
  metanav,
  langnav,
  logoName,
  colorMode,
}: InterfaceHeaderPropTypes): React.JSX.Element => (
  <header className={`${styles.header} ${styles[colorMode]}`}>
    <HeaderLogo
      className={styles.logo}
      name={logoName}
      colorMode={colorMode}
    />

    <Navigation
      {...navigation}
      className={styles.navigation}
      colorMode={colorMode}
    />

    <NavigationInfoBlock
      {...navigationInfoBlock}
      className={styles.infoBlock}
      colorMode={colorMode}
    />

    <Langnav
      {...langnav}
      className={styles.langnav}
      colorMode={colorMode}
    />

    <Metanav
      {...metanav}
      className={styles.metanav}
      colorMode={colorMode}
    />

    <MenuButton
      {...menuButton}
      className={styles.menuButton}
      colorMode={colorMode}
    />
  </header>
);
