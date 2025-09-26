import React from 'react';
import styles from '@/components/base/Header/Header.module.scss';
import {
  InterfaceNavigationPropTypes, Navigation,
} from '../Navigation/Navigation';
import {
  InterfaceMenuButtonPropTypes, MenuButton,
} from '../MenuButton/MenuButton';
import {
  InterfaceNavigationInfoBlockPropTypes, NavigationInfoBlock,
} from '../NavigationInfoBlock/NavigationInfoBlock';
import {
  InterfaceMetanavPropTypes, Metanav,
} from '../Metanav/Metanav';
import {
  InterfaceLangnavPropTypes, Langnav,
} from '../Langnav/Langnav';

export type InterfaceHeaderPropTypes = {
  navigation: InterfaceNavigationPropTypes;
  menuButton: InterfaceMenuButtonPropTypes;
  navigationInfoBlock: InterfaceNavigationInfoBlockPropTypes;
  metanav: InterfaceMetanavPropTypes;
  langnav: InterfaceLangnavPropTypes;
};

export const Header = ({
  navigation,
  menuButton,
  navigationInfoBlock,
  metanav,
  langnav,
}: InterfaceHeaderPropTypes): React.JSX.Element => (
  <header className={styles.header}>
    <div className={styles.logo}>Logo</div>

    <Navigation
      {...navigation}
      className={styles.navigation}
    />

    <NavigationInfoBlock
      {...navigationInfoBlock}
      className={styles.infoBlock}
    />

    <Langnav
      {...langnav}
      className={styles.langnav}
    />

    <Metanav
      {...metanav}
      className={styles.metanav}
    />

    <MenuButton
      {...menuButton}
      className={styles.menuButton}
    />
  </header>
);
