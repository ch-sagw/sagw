// TODO
// - hidden text from navigationInfoBlock
// - level 2 with long texts have overflow. is there a smart solution?
// - connect Header to cms

import React, {
  Fragment, useState,
} from 'react';
import styles from '@/components/global/Header/Header.module.scss';
import {
  InterfaceHoveredItemCallbackType,
  InterfaceNavigationPropTypes,
  Navigation,
} from '@/components/base/Navigation/Navigation';
import {
  InterfaceMenuButtonPropTypes,
  MenuButton,
} from '@/components/base/MenuButton/MenuButton';
import {
  InterfaceNavigationInfoBlockPropTypes,
  NavigationInfoBlock,
} from '@/components/base/NavigationInfoBlock/NavigationInfoBlock';
import {
  InterfaceMetanavPropTypes,
  Metanav,
} from '@/components/base/Metanav/Metanav';
import {
  InterfaceLangnavPropTypes,
  Langnav,
} from '@/components/base/Langnav/Langnav';
import { ColorMode } from '@/components/base/types/colorMode';

import { HeaderLogo } from '@/components/base/HeaderLogo/HeaderLogo';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// --- Interfaces

export type InterfaceHeaderPropTypes = {
  navigation: InterfaceNavigationPropTypes;
  menuButton: InterfaceMenuButtonPropTypes;
  navigationInfoBlock: InterfaceNavigationInfoBlockPropTypes;
  metanav: InterfaceMetanavPropTypes;
  langnav: InterfaceLangnavPropTypes;
  logoName: 'sagw';
  colorMode: ColorMode;
};

// --- Component

export const Header = (props: InterfaceHeaderPropTypes): React.JSX.Element => {

  // --- Hooks

  const breakpoint = useBreakpoint();

  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro' || breakpoint === 'medium';

  // --- State

  const [
    infoBlockContent,
    setInfoBlockContent,
  ] = useState<{ title: string; text: string } | undefined>();

  // --- Callbacks

  const handleHoveredItem = ((item: InterfaceHoveredItemCallbackType): void => {
    const [selectedItem] = Object.keys(item);

    if (item[selectedItem]) {
      const {
        sections,
      } = props.navigation;

      const selectedSections = sections.filter((section) => String(section.expandableId) === selectedItem);

      if (selectedSections.length > 0) {
        setInfoBlockContent({
          text: selectedSections[0].description || '',
          title: selectedSections[0].text,
        });

      }

    } else {
      setInfoBlockContent(undefined);
    }
  });

  // --- Render Helpers

  const metanavRender = (): React.JSX.Element => (
    <Metanav
      {...props.metanav}
      className={styles.metanav}
      colorMode={props.colorMode}
    />
  );

  const langnavRender = (): React.JSX.Element => (
    <Langnav
      {...props.langnav}
      className={styles.langnav}
      colorMode={props.colorMode}
    />
  );

  const navigationInfoBlockRender = (): React.JSX.Element => (
    <NavigationInfoBlock
      {...props.navigationInfoBlock}
      className={styles.infoBlock}
      colorMode={props.colorMode}
      text={infoBlockContent?.text || ''}
      title={infoBlockContent?.title || ''}
    />
  );

  const navigationRender = (): React.JSX.Element => (
    <Navigation
      {...props.navigation}
      className={styles.navigation}
      colorMode={props.colorMode}
      hoveredItemCallback={handleHoveredItem}
    />
  );

  const headerLogoRender = (): React.JSX.Element => (
    <HeaderLogo
      className={styles.logo}
      name={props.logoName}
      colorMode={props.colorMode}
    />
  );

  const menuButtonRender = (): React.JSX.Element => (
    <MenuButton
      {...props.menuButton}
      className={styles.menuButton}
      colorMode={props.colorMode}
    />
  );

  // --- Render

  return (
    <header className={`${styles.header} ${styles[props.colorMode]}`}>

      {smallBreakpoint &&
        <Fragment>
          <div className={styles.logoWrapper}>
            {headerLogoRender()}
            {menuButtonRender()}
          </div>

          {navigationRender()}

          <div className={`${styles.horizontalLine} ${styles[props.colorMode]}`}></div>

          {langnavRender()}
          {metanavRender()}
        </Fragment>
      }

      {!smallBreakpoint &&
        <Fragment>
          {metanavRender()}

          <div className={styles.logoWrapper}>
            {headerLogoRender()}
            {navigationRender()}
            {langnavRender()}
          </div>

          {navigationInfoBlockRender()}
        </Fragment>
      }
    </header>
  );
};
