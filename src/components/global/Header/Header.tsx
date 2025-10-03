// TODO
// - level 2 with long texts have overflow. is there a smart solution?
// - level1 link without children is vertically 1px off

/*
TODOs from marius
----
- der infoblock hat aktuell kein fade-in analog der subnavi
- in den chromium basierten browsern (edge/chrome) kann ich bei mir in nvda
und jaws das untermenü nicht öffnen. weder mit space noch enter.
im firefox klappt es

// Done TODOs from marius
----
- das logo sollte verlinkt sein und zurück zur startseite führen
- das logo ist im small viewport im safari zuweit eingerückt wegen dem
width: 100%, dort würde ich auf width: auto
- die visuell versteckten texte in den nav buttons würde ich entfernen.
auf mobile gibt es kein visuelles gegenstück. daher sind sie eher
verwirrend. beispiel: <button class="_button_ezu18_1 _buttonLevel1_tdeb6_30
_buttonText_ezu18_147" data-testid="button" type="button"
aria-expanded="false"><span class="_visuallyHidden_ezu18_62">Unsere 63
Fachgesellschaften unter einem Dach</span><span class="_innerText_ezu18_173">
Netzwerk<span class="_line_ezu18_178"></span></span></button>
- für den lang nav toggle button müssen wir noch eine neue klasse erstellen
'isActive'  im button.module.scss .isActive, &[aria-current]
{ der soll immer unterstrichen sein
- in der lang nav müssen wir noch die aktuelle sprache auszeichnen.
- in den varianten header light und white, haben die pfeile in der mobile
variante die falsche farbe
- derzeit expandiert sich der header in der desktop-variante bei keyboard-fokus,
jedoch ohne die untermenüs zu zeigen. aus meiner sicht, sollten die menüs bei
keyboard-bedienung nur nach expliziter interaktion expandieren.
- ich hätte das submenü auf der nicht mobile variante eher als overlay
interpretiert. im moment schiebt es ja den ganzen inhalt runter. -> der vorteil
der aktuellen variante wäre, dass wir weniger probleme beim nur-text zoom haben
mit dem sticky header. nur text-zoom funktioniert aktuell noch nicht ideal.
der sticky header kriegt die höhe in pixel. damit der proportional mit
der schrift mitskaliert, müssten wir die angaben in rem setzen. wenn man dies
macht, haben wir aber je nach viewport-breite ungünstige umbrüche, teilweise
schon bei 120%.
- im safari auf iOS 26.0 kann ich mit voice over aus der mobile navigation
rausswipen.

*/

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
  InterfaceHeaderLanguageNavigation, InterfaceHeaderLogo, InterfaceHeaderMetaNavigation, InterfaceHeaderNavigation,
} from '@/payload-types';

// --- Interfaces

export type InterfaceHeaderPropTypesCms = {
  langnav: InterfaceHeaderLanguageNavigation;
  logo: InterfaceHeaderLogo;
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

  // --- Refs

  const headerRef = useRef<HTMLElement>(null);

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

  // set nav height
  useEffect(() => {
    if (!headerRef.current) {
      return;
    }

    if (!smallBreakpoint) {
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
  ]);

  // handle scroll
  useEffect(() => {

    // 0 would be too brutal
    setDidScroll(scrollPosition > 50);
  }, [scrollPosition]);

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
          text: selectedSections[0].description || '',
          title: selectedSections[0].navItemText,
        });

      }

    } else {
      setInfoBlockContent(undefined);

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

      setInfoBlockContent(visibility
        ? {
          text: props.langnav.description || '',
          title: props.langnav.title || '',
        }
        : undefined);
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
        <Metanav
          items={props.metanav.metaLinks?.map((item) => {
            if (item.linkType === 'internal') {
              return {
                link: item.linkInternal?.internalLink || '',
                target: '_self',
                text: item.linkInternal?.linkText || '',
              };
            }

            return {
              link: item.linkExternal?.externalLink || '',
              target: '_blank',
              text: item.linkExternal?.externalLinkText || '',
            };
          }) || []}
          className={styles.metanav}
          colorMode={renderColorMode()}
        />
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
      title={props.langnav.title}
      description={props.langnav.description}
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
    />
  );

  const navigationRender = (): React.JSX.Element => (
    <Navigation

      sections={props.navigation.navItems.map((item, key) => {
        if (item.subNavItems) {

          // level 1 with subnav items
          return {
            colorMode: props.colorMode,
            description: item.description || '',
            expandableId: item.id || String(key),
            footer: false,
            items: item.subNavItems.map((subnavItem) => ({
              colorMode: props.colorMode,
              footer: false,
              link: subnavItem.navItemLink || '',
              text: subnavItem.navItemText || '',
            })),
            setExpanded: undefined,
            text: item.navItemText || '',
          };
        }

        // level 1 without subnav items
        return {
          colorMode: props.colorMode,
          footer: false,
          link: item.navItemLink || '',
          text: item.navItemText || '',
        };

      })}
      footer={false}
      className={styles.navigation}
      colorMode={renderColorMode()}
      hoveredItemCallback={handleHoveredItem}
      navMaxHeightCallback={(maxHeight: number) => {
        if (maxHeight >= 0) {
          setNavMaxHeight(maxHeight);
        }
      }}
    />
  );

  const headerLogoRender = (): React.JSX.Element => {

    // TODO: is fallback to SAGW ok?

    const logoName = (props.logo.logo in Logos
      ? props.logo.logo
      : 'sagw') as keyof typeof Logos;

    return (
      <HeaderLogo
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
