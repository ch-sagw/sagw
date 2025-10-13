'use client';

import React, {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';
import styles from '@/components/global/Header/Header.module.scss';
import {
  InterfaceHoveredItemCallbackType,
  Navigation,
} from '@/components/base/Navigation/Navigation';
import { MenuButton } from '@/components/base/MenuButton/MenuButton';
import { NavigationInfoBlock } from '@/components/base/NavigationInfoBlock/NavigationInfoBlock';
import { Metanav } from '@/components/base/Metanav/Metanav';
import { Langnav } from '@/components/base/Langnav/Langnav';
import { ColorMode } from '@/components/base/types/colorMode';

import {
  HeaderLogo, Logos,
} from '@/components/base/HeaderLogo/HeaderLogo';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useWindowScroll } from '@/hooks/useWindowScroll';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useInputMethod } from '@/hooks/useInputMethod';
import { useFocusTrap } from '@/hooks/useFocusTrap';

import {
  InterfaceHeaderLanguageNavigation, InterfaceHeaderMetaNavigation, InterfaceHeaderNavigation,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';

// --- Interfaces

export type InterfaceHeaderPropTypesCms = {
  langnav: InterfaceHeaderLanguageNavigation;
  metanav: InterfaceHeaderMetaNavigation;
  navigation: InterfaceHeaderNavigation;
}

export type InterfaceHeaderPropTypes = {
  colorMode: ColorMode;
  menuButton: {
    open: string,
    close: string,
  };
  currentLang: string;
  logoLink: string;
} & InterfaceHeaderPropTypesCms;

// --- Component

export const Header = (props: InterfaceHeaderPropTypes): React.JSX.Element => {

  const infoBlockMargin = 48;

  // --- Refs

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // --- State

  const [
    isHovering,
    setIsHovering,
  ] = useState(false);

  const [
    infoBlockContent,
    setInfoBlockContent,
  ] = useState<{ title: string; text: string } | undefined>();

  const [
    navMaxHeight,
    setNavMaxHeight,
  ] = useState(0);

  const [
    langNavMaxHeight,
    setLangNavMaxHeight,
  ] = useState(0);

  const [
    totalHeaderHeight,
    setTotalHeaderHeight,
  ] = useState(0);

  const [
    headerNaturalHeight,
    setHeaderNatualHeight,
  ] = useState(0);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    didScroll,
    setDidScroll,
  ] = useState(false);

  const [
    bodyFontSize,
    setBodyFontSize,
  ] = useState(16);

  const [
    hoveredSection,
    setHoveredSection,
  ] = useState<'mainNav' | 'langNav' | null>(null);

  // With default fallback value in rem (210px / 16px)
  const [
    infoBlockTop,
    setInfoBlockTop,
  ] = useState(13.125);

  // --- Hooks

  useScrollLock(mobileMenuOpen);
  useFocusTrap({
    condition: mobileMenuOpen,
    focusTrapRootElement: headerRef.current?.querySelector<HTMLDivElement>('[data-header="focus-region"]'),
    ignoreElementsWithClasses: [styles.logo],
  });

  const isKeyboard = useInputMethod();
  const breakpoint = useBreakpoint();
  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro' || breakpoint === 'medium';
  const scrollPosition = useWindowScroll();

  // close on escape
  useKeyboardShortcut({
    condition: isHovering,
    key: 'Escape',
    onKeyPressed: () => {
      setIsHovering(false);
    },
  });

  // --- Effects

  // set body font size
  useEffect(() => {
    const bodyFontSizeDefinition = window.getComputedStyle(document.body)
      .getPropertyValue('font-size')
      .split('px');

    setBodyFontSize(parseInt(bodyFontSizeDefinition[0], 10) || 16);
  }, []);

  // calculate infoBlock position
  useEffect(() => {
    if (!logoRef.current || smallBreakpoint || !headerRef.current) {
      return;
    }

    const logoRect = logoRef.current.getBoundingClientRect();
    const newTopPositionRem = (logoRect.bottom + infoBlockMargin) / bodyFontSize;

    setInfoBlockTop(newTopPositionRem);
  }, [
    smallBreakpoint,
    breakpoint,
    bodyFontSize,
  ]);

  // reset navigation heights when breakpoint changes
  useEffect(() => {
    setNavMaxHeight(0);
    setLangNavMaxHeight(0);
  }, [breakpoint]);

  // set nav height
  useEffect(() => {
    if (!headerRef.current) {
      return;
    }

    if (smallBreakpoint) {
      // Reset heights when in small breakpoint
      setHeaderNatualHeight(0);
      setTotalHeaderHeight(0);
    } else {
      const naturalHeight = headerRef.current.offsetHeight;
      const langOrNavMaxHeight = Math.max(navMaxHeight, langNavMaxHeight);

      setHeaderNatualHeight(naturalHeight / bodyFontSize);
      setTotalHeaderHeight((naturalHeight + langOrNavMaxHeight) / bodyFontSize);
    }
  }, [
    navMaxHeight,
    langNavMaxHeight,
    props,
    smallBreakpoint,
    bodyFontSize,

    // Add breakpoint to trigger recalculation on viewport changes
    breakpoint,
  ]);

  // handle scroll
  useEffect(() => {

    // 0 would be too brutal
    setDidScroll(scrollPosition > 50);
  }, [scrollPosition]);

  // add mouse leave detection to reset hover state when mouse leaves header
  useEffect(() => {
    const handleMouseLeave = (): void => {
      // Reset hover state when mouse leaves the header area
      if (isHovering) {
        setIsHovering(false);
        setHoveredSection(null);
        setInfoBlockContent(undefined);
      }
    };

    const headerElement = headerRef.current;

    if (headerElement) {
      headerElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return (): void => {
      if (headerElement) {
        headerElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isHovering]);

  // --- Callbacks

  const handleHoveredItem = (item: InterfaceHoveredItemCallbackType): void => {

    const [selectedItem] = Object.keys(item);

    if (item[selectedItem]) {
      setIsHovering(true);
      setHoveredSection('mainNav');

      const {
        navItems,
      } = props.navigation;

      const selectedSections = navItems.filter((section) => section.id === selectedItem);

      if (selectedSections.length > 0) {
        setInfoBlockContent({
          text: rteToHtml(selectedSections[0].description),
          title: rteToHtml(selectedSections[0].navItemText),
        });
      }
    } else {
      // Clear content immediately when leaving a navigation item
      setInfoBlockContent(undefined);

      // Only collapse if we're not in mainNav section
      // (to prevent flickering when moving between items)
      if (hoveredSection !== 'mainNav') {
        setIsHovering(false);
        setHoveredSection(null);
      }

      // on keyboard navigation, hide the menu
      if (isKeyboard && isHovering && hoveredSection === 'mainNav') {
        setIsHovering(false);
      }
    }
  };

  const handleLangNavHover = useCallback((visibility: boolean): void => {
    if (smallBreakpoint) {
      return;
    }

    if (!isHovering) {
      setIsHovering(visibility);
    }

    if (isHovering && visibility) {
      setHoveredSection('langNav');

      setInfoBlockContent({
        text: rteToHtml(props.langnav.description),
        title: rteToHtml(props.langnav.title),
      });
    }

    // Clear info block when leaving lang-nav, but only if we're not in mainNav
    if (!visibility && hoveredSection !== 'mainNav') {
      setInfoBlockContent(undefined);
      setHoveredSection(null);
    }

    // on keyboard navigation, hide the menu
    if (isHovering && !visibility && isKeyboard && hoveredSection === 'langNav') {
      setIsHovering(false);
    }
  }, [
    isHovering,
    smallBreakpoint,
    props.langnav.description,
    props.langnav.title,
    isKeyboard,
    hoveredSection,
  ]);

  const handleLangHeightChange = useCallback((height: number) => {
    if (smallBreakpoint) {
      return;
    }
    setLangNavMaxHeight((prev) => (prev === height
      ? prev
      : height));
  }, [smallBreakpoint]);

  // --- Render Helpers

  const renderColorMode = (): ColorMode => {
    let {
      colorMode,
    } = props;

    if ((didScroll && !isHovering) && !(smallBreakpoint && mobileMenuOpen)) {
      colorMode = 'white';
    }

    return colorMode;
  };

  const metanavRender = (): React.JSX.Element => {
    if (props.metanav.metaLinks && props.metanav.metaLinks?.length > 0) {
      return (
        <div className={`${styles.metanavWrapper} ${didScroll
          ? styles.metanavHidden
          : ''}`}>
          <Metanav
            items={props.metanav.metaLinks?.map((item) => {
              if (item.linkType === 'internal') {
                return {
                  link: item.linkInternal?.internalLink || '',
                  target: '_self',
                  text: rteToHtml(item.linkInternal?.linkText),
                };
              }

              return {
                link: item.linkExternal?.externalLink || '',
                target: '_blank',
                text: rteToHtml(item.linkExternal?.externalLinkText),
              };
            }) || []}
            className={styles.metanav}
            colorMode={renderColorMode()}
          />
        </div>
      );
    }

    return <Fragment />;
  };

  const langnavRender = (): React.JSX.Element => (
    <Langnav

      // TODO: put in internal i18n
      items={[
        {
          shortText: 'De',
          text: 'Deutsch',
          value: 'de',
        },
        {
          shortText: 'Fr',
          text: 'Français',
          value: 'fr',
        },
        {
          shortText: 'It',
          text: 'Italiano',
          value: 'it',
        },
        {
          shortText: 'En',
          text: 'English',
          value: 'en',
        },
      ]}
      currentLang=''
      title={rteToHtml(props.langnav.title)}
      description={rteToHtml(props.langnav.description)}
      className={styles.langnav}
      colorMode={renderColorMode()}
      visibilityCallback={handleLangNavHover}
      onHeightChange={handleLangHeightChange}
      onLangSelect={() => {
        console.log('TODO: on lang select');
      }}
    />
  );

  const navigationInfoBlockRender = (): React.JSX.Element => (
    <NavigationInfoBlock
      className={styles.infoBlock}
      colorMode={renderColorMode()}
      text={infoBlockContent?.text || ''}
      title={infoBlockContent?.title || ''}
      style={{
        top: `${infoBlockTop}rem`,
      }}
    />
  );

  const navigationRender = (): React.JSX.Element => (
    <Navigation

      sections={props.navigation.navItems.map((item, key) => {
        if (item.subNavItems) {

          // level 1 with subnav items
          return {
            colorMode: props.colorMode,
            description: rteToHtml(item.description),
            expandableId: item.id || String(key),
            footer: false,
            items: item.subNavItems.map((subnavItem) => ({
              colorMode: props.colorMode,
              footer: false,
              link: subnavItem.navItemLink || '',
              text: rteToHtml(subnavItem.navItemText),
            })),
            setExpanded: undefined,
            text: rteToHtml(item.navItemText) || '',
          };
        }

        // level 1 without subnav items
        return {
          colorMode: props.colorMode,
          footer: false,
          link: item.navItemLink || '',
          text: rteToHtml(item.navItemText),
        };

      })}
      footer={false}
      className={styles.navigation}
      colorMode={renderColorMode()}
      hoveredItemCallback={handleHoveredItem}
      onHoverItemWithoutChildren={() => {
        // Collapse header when hovering over items without children
        if (isHovering && hoveredSection === 'mainNav') {
          setIsHovering(false);
        }
      }}
      navMaxHeightCallback={(maxHeight: number) => {
        if (maxHeight >= 0) {
          setNavMaxHeight(maxHeight);
        }
      }}
    />
  );

  const headerLogoRender = (): React.JSX.Element => {

    // TODO: derive logo name from tenant

    const logoName = 'sagw' as keyof typeof Logos;

    return (
      <HeaderLogo
        ref={logoRef}
        link={props.logoLink}

        // TODO: define in i18n in code
        linkText='Back to Homepage'
        className={styles.logo}
        name={logoName}
        colorMode={renderColorMode()}
      />
    );
  };

  const menuButtonRender = (): React.JSX.Element => (
    <MenuButton
      hiddenTexts={{
        closeMenu: props.menuButton.close,
        openMenu: props.menuButton.open,
      }}
      className={styles.menuButton}
      colorMode={renderColorMode()}
      open={mobileMenuOpen}
      onClick={() => {
        setMobileMenuOpen(!mobileMenuOpen);

      }}
    />
  );

  // --- Render

  return (
    <header
      data-testid='header'
      style={totalHeaderHeight && !smallBreakpoint
        ? {
          height: isHovering

            // 72 for the bottom padding of the nav-content
            ? `${totalHeaderHeight + (72 / bodyFontSize)}rem`
            : `${headerNaturalHeight}rem`,
        }
        : {
          height: 'auto',
        }
      }
      ref={headerRef}
      className={`${styles.header} ${styles[renderColorMode()]} ${mobileMenuOpen
        ? styles.expanded
        : undefined}`}
    >

      {smallBreakpoint &&
        <div data-header='focus-region'>
          <div className={styles.logoWrapper}>
            {headerLogoRender()}
            {menuButtonRender()}
          </div>

          <div
            className={`${styles.mobileMenu} ${mobileMenuOpen
              ? styles.open
              : undefined}`}
            inert={!mobileMenuOpen || undefined}
            role='dialog'
            aria-modal='true'
          >
            <div className={styles.mobileMenuWrapper}>
              {navigationRender()}

              <div
                className={`${styles.horizontalLine} ${styles[renderColorMode()]}`}
              ></div>

              {langnavRender()}
              {metanavRender()}
            </div>
          </div>
        </div>
      }

      {!smallBreakpoint &&
        <Fragment>
          {metanavRender()}

          <div
            className={styles.logoWrapper}
            onMouseLeave={() => {
              setIsHovering(false);
            }}
          >
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
