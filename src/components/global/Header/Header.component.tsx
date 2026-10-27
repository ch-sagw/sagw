
'use client';

import React, {
  Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore,
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
  useLocale, useTranslations,
} from 'next-intl';

import {
  type Config,
  InterfaceHeaderMetaNavigation, InterfaceHeaderNavigation,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';

// --- Interfaces

export type InterfaceHeaderComponentPropTypes = {
  colorMode: ColorMode;
  enabledLocales: Config['locale'][];
  menuButton: {
    open: string,
    close: string,
  };
  logoLink: string;
  metanav?: InterfaceHeaderMetaNavigation;
  navigation: InterfaceHeaderNavigation;
  linkUrls: Record<string, string>;
  localeUrls: Record<string, string>;
  tenant: string;
}

// --- Helpers

// used by useSyncExternalStore for hydration detection; nothing to subscribe to
const subscribeNoop = (): (() => void) => (): void => undefined;

// --- Component

export const HeaderComponent = (props: InterfaceHeaderComponentPropTypes): React.JSX.Element => {
  const locale = useLocale();
  const langNavTranslations = useTranslations('langNav');
  const i18nLandmarks = useTranslations('landmarks');
  const i18nA11y = useTranslations('a11y');

  // --- Refs
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const metanavRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const focusRegionRef = useRef<HTMLDivElement>(null);
  const initialNavHeightRef = useRef<number>(null);
  const initialMetaNavHeightRef = useRef<number>(null);
  const initialLangOrNavMaxHeightRef = useRef<number>(null);

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
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    hoveredSection,
    setHoveredSection,
  ] = useState<'mainNav' | 'langNav' | null>(null);

  const [
    expandedDesktopNavItem,
    setExpandedDesktopNavItem,
  ] = useState<string | undefined>();

  // false during SSR / hydration, true once rendered on the client
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const [
    fontSize,
    setFontSize,
  ] = useState<number>(() => {
    // Provide a sensible default (16px) for SSR
    // or when document is unavailable
    if (typeof window === 'undefined' || !document.body) {
      return 16;
    }

    const style = window.getComputedStyle(document.body);

    return parseFloat(style.fontSize) || 16;
  });

  const isKeyboard = useInputMethod();
  const breakpoint = useBreakpoint();
  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro' || breakpoint === 'medium';
  const scrollPosition = useWindowScroll();

  // 0 would be too brutal
  const didScroll = scrollPosition > 1;

  // reset navigation heights when breakpoint changes
  const [
    prevBreakpoint,
    setPrevBreakpoint,
  ] = useState(breakpoint);

  if (breakpoint !== prevBreakpoint) {
    setPrevBreakpoint(breakpoint);
    setNavMaxHeight(0);
    setMobileMenuOpen(false);
    setExpandedDesktopNavItem(undefined);

    if (smallBreakpoint) {
      // no header height calculation in small breakpoints
      setTotalHeaderHeight(0);
    }
  }

  const calculateHeaderHeight = useCallback((): void => {
    if (!headerRef.current || smallBreakpoint || isHovering) {
      return;
    }

    const headerElement = headerRef.current;

    headerElement.removeAttribute('style');

    setInfoBlockContent(undefined);

    const headerHeight = Math.round(headerElement.offsetHeight);

    if (headerElement && initialNavHeightRef.current === null) {
      initialNavHeightRef.current = headerHeight;
    }

    // When we clone one of the subnavigation items, they lack some
    // styling information. Cloning them with all possible inline stylings
    // would be quite brutal. Without the styling, the measurements return
    // wrong padding sizes for the ul. We therefore compensate the missing
    // paddings of the cloned ul elements manually, which should be good
    // enough. We compensate 16px (large) / 100px (ultra)
    let paddingCompensation = 16;

    if (breakpoint === 'ultra') {
      paddingCompensation = 100;
    }

    const langOrNavMaxHeight = Math.round(Math.max(
      navMaxHeight,
      langNavMaxHeight,
    ) + paddingCompensation);

    if (initialLangOrNavMaxHeightRef.current === null) {
      initialLangOrNavMaxHeightRef.current = langOrNavMaxHeight;
    }

    let totalHeight = headerHeight + langOrNavMaxHeight;

    if (initialNavHeightRef.current) {
      totalHeight = initialNavHeightRef.current + langOrNavMaxHeight;
    }

    setTotalHeaderHeight(totalHeight);

  }, [
    breakpoint,
    smallBreakpoint,
    navMaxHeight,
    langNavMaxHeight,
    isHovering,
  ]);

  const setMetaNavHeight = useCallback((): void => {
    if (
      !headerRef.current ||
      !metanavRef.current ||
      smallBreakpoint ||
      isHovering
    ) {
      return;
    }

    const headerElement = headerRef.current;
    const metanavElement = metanavRef.current;
    const metaNavHeight = Math.round(metanavElement?.offsetHeight + 24);

    if (didScroll) {
      headerElement.style.setProperty(
        '--meta-nav-height',
        `-${metaNavHeight / fontSize}rem`,
      );
    } else {
      headerElement.style.setProperty('--meta-nav-height', '0');
    }
  }, [
    didScroll,
    fontSize,
    isHovering,
    smallBreakpoint,
  ]);

  // --- Hooks
  useFocusTrap({
    condition: mobileMenuOpen,
    focusTrapRootRef: focusRegionRef,
    ignoreElementsWithClasses: [styles.logo],
  });

  // close on escape
  useKeyboardShortcut({
    condition: isHovering,
    key: 'Escape',
    onKeyPressed: () => {
      setIsHovering(false);
      setInfoBlockContent(undefined);
      setExpandedDesktopNavItem(undefined);
    },
  });

  useScrollLock(mobileMenuOpen && smallBreakpoint);

  // --- Effects

  // listen to body font size changes
  // e.g. text only zoom in firefox
  useEffect(() => {
    const {
      body,
    } = document;

    // Create a ResizeObserver to watch for font size changes
    const observer = new ResizeObserver(() => {
      const style = window.getComputedStyle(body);
      const newFontSize = Math.round(parseFloat(style.fontSize));

      setFontSize(newFontSize);
      // calculateHeaderHeight();
    });

    observer.observe(body);

    // Clean up on unmount
    return (): void => {
      observer.disconnect();
    };
  }, [
    calculateHeaderHeight,
    setMetaNavHeight,
  ]);

  // reset cached measurements when breakpoint changes
  // (the related state resets happen during render, see above)
  useEffect(() => {
    initialNavHeightRef.current = null;
    initialMetaNavHeightRef.current = null;
    initialLangOrNavMaxHeightRef.current = null;
  }, [breakpoint]);

  // set nav height
  useEffect(() => {
    if (!headerRef.current || smallBreakpoint) {
      return;
    }

    calculateHeaderHeight();
    setMetaNavHeight();

  }, [
    // fontSize,
    // navMaxHeight,
    // langNavMaxHeight,
    // props,
    smallBreakpoint,
    calculateHeaderHeight,
    setMetaNavHeight,

    // Add breakpoint to trigger recalculation on viewport changes
    breakpoint,
  ]);

  // add mouse leave detection to reset hover state when mouse leaves header.
  // Uses pointer events restricted to a real mouse so that compatibility
  // mouse events emitted after touch taps don't collapse the header.
  useEffect(() => {
    const handleMouseLeave = (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') {
        return;
      }

      // Reset hover state when mouse leaves the header area
      if (isHovering) {
        setIsHovering(false);
        setHoveredSection(null);
        setInfoBlockContent(undefined);
      }
    };

    const headerElement = headerRef.current;
    const navigationElement = navigationRef.current;

    if (headerElement) {
      headerElement.addEventListener('pointerleave', handleMouseLeave);
    }

    if (navigationElement) {
      navigationElement.addEventListener('pointerleave', handleMouseLeave);
    }

    return (): void => {
      if (headerElement) {
        headerElement.removeEventListener('pointerleave', handleMouseLeave);
      }
      if (navigationElement) {
        navigationElement.removeEventListener('pointerleave', handleMouseLeave);
      }
    };
  }, [isHovering]);

  useEffect(() => {
    if (!isHovering) {
      return (): void => undefined;
    }

    const handlePointerDown = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') {
        return;
      }

      const target = e.target as Node;
      const header = headerRef.current;

      const parentElementIsButton = (target as Element).closest('button');
      const parentButtonIsExpanded = parentElementIsButton?.getAttribute('aria-expanded') === 'true';

      const parentLinkElement = (target as Element).closest('a') !== null;

      if (
        header &&
        header.contains(target) &&
        (parentButtonIsExpanded || parentLinkElement)
      ) {
        return;
      }

      setHoveredSection(null);
      setInfoBlockContent(undefined);
      setExpandedDesktopNavItem(undefined);
      setIsHovering(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return (): void => {
      document.removeEventListener('pointerdown', handlePointerDown);
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
        const [selectedSection] = selectedSections;
        const {
          subNavItems,
        } = selectedSection;

        if (subNavItems && subNavItems.length > 0) {
          setInfoBlockContent({
            text: rteToHtml(selectedSections[0].description),
            title: rteToHtml(selectedSections[0].navItemText),
          });
        } else {
          setIsHovering(false);
          setHoveredSection(null);
        }
      }
    } else {
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
      setInfoBlockContent(undefined);
    }

    // Clear info block when leaving lang-nav, but only if we're not in mainNav
    if (!visibility && hoveredSection !== 'mainNav') {
      setIsHovering(false);
      setHoveredSection(null);
      setInfoBlockContent(undefined);
      setExpandedDesktopNavItem(undefined);
    }

    // on keyboard navigation, hide the menu
    if (isHovering && !visibility && isKeyboard && hoveredSection === 'langNav') {
      setIsHovering(false);
    }
  }, [
    isHovering,
    smallBreakpoint,
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

    if ((didScroll || isHovering) && !(smallBreakpoint && mobileMenuOpen)) {
      colorMode = 'white';
    } else if (smallBreakpoint && mobileMenuOpen) {
      colorMode = 'dark';
    }

    return colorMode;
  };

  const metanavRender = (): React.JSX.Element => {
    if (props.metanav?.metaLinks && props.metanav.metaLinks?.length > 0) {
      return (
        <div
          ref={metanavRef}
          className={`${styles.metanavWrapper} ${didScroll
            ? styles.metanavHidden
            : ''}`}
        >
          <Metanav
            items={props.metanav.metaLinks?.map((item) => {

              const tabindex = didScroll
                ? -1
                : undefined;

              if (item.linkType === 'internal') {
                const documentId = item.linkInternal?.internalLink?.documentId;
                const href = documentId
                  ? props.linkUrls[documentId] || ''
                  : '';

                return {
                  link: href,
                  tabindex,
                  target: '_self',
                  text: rteToHtml(item.linkInternal?.linkText),
                };
              }

              if (item.linkType === 'mail') {
                return {
                  link: item.linkMail?.email
                    ? `mailto:${item.linkMail.email}`
                    : '',
                  tabindex,
                  target: '_self',
                  text: rteToHtml(item.linkMail?.linkText),
                };
              }

              return {
                link: item.linkExternal?.externalLink || '',
                tabindex,
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

  const langnavRender = (): React.JSX.Element => {
    if (props.enabledLocales.length < 1) {
      return <Fragment />;
    }

    const shortTextByLocale: Record<Config['locale'], string> = {
      de: 'De',
      en: 'En',
      fr: 'Fr',
      it: 'It',
    };

    const items = props.enabledLocales.map((code) => ({
      href: props.localeUrls[code] || '',
      shortText: shortTextByLocale[code],
      text: langNavTranslations(code),
      value: code,
    }));

    return (
      <Langnav
        items={items}
        currentLang={locale}
        className={styles.langnav}
        colorMode={renderColorMode()}
        visibilityCallbackAction={handleLangNavHover}
        onHeightChangeAction={handleLangHeightChange}
      />
    );
  };

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
      ref={navigationRef}
      sections={props.navigation.navItems.map((item, key) => {
        if (item.subNavItems && item.subNavItems.length > 0) {

          // level 1 with subnav items
          return {
            colorMode: props.colorMode,
            description: rteToHtml(item.description),
            expandableId: item.id || String(key),
            footer: false,
            items: item.subNavItems.map((subnavItem) => {
              const documentId = subnavItem.navItemLink?.documentId;
              const href = documentId
                ? props.linkUrls[documentId] || ''
                : '';

              return {
                colorMode: props.colorMode,
                footer: false,
                link: href,
                text: rteToHtml(subnavItem.navItemText),
              };
            }),
            setExpanded: undefined,
            text: rteToHtml(item.navItemText) || '',
          };
        }

        // level 1 without subnav items
        const documentId = item.navItemLink?.documentId;
        const href = documentId
          ? props.linkUrls[documentId] || ''
          : '';

        return {
          colorMode: props.colorMode,
          footer: false,
          link: href,
          text: rteToHtml(item.navItemText),
        };

      })}
      footer={false}
      className={styles.navigation}
      colorMode={renderColorMode()}
      expandedItem={expandedDesktopNavItem}
      onExpandedItemChange={setExpandedDesktopNavItem}
      hoveredItemCallback={handleHoveredItem}
      onHoverItemWithoutChildren={() => {
        // Collapse header when hovering over items without children
        if (isHovering && hoveredSection === 'mainNav') {
          setIsHovering(false);
          setInfoBlockContent(undefined);
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
    const tenantName = props.tenant.toLowerCase();

    // In Playwright tests we have tenant names starting
    // with tenant- which we have to map to «sagw».
    const logoName = tenantName.indexOf('tenant-') === -1
      ? tenantName
      : 'sagw';

    return (
      <div className={styles.logoWrapperInner}>
        <HeaderLogo
          ref={logoRef}
          link={props.logoLink}
          linkText={i18nA11y('logoLinkText')}
          className={styles.logo}
          name={logoName as keyof typeof Logos}
          colorMode={renderColorMode()}
        />
      </div>
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
  const tempStickyStyles = (didScroll && !smallBreakpoint)
    ? styles.sticky
    : '';

  const tempStickyExpanded = mobileMenuOpen
    ? styles.expanded
    : undefined;

  return (
    <header
      aria-label={i18nLandmarks('header')}
      data-testid='header'
      ref={headerRef}
      className={`${styles.header} ${styles[renderColorMode()]} ${hydrated
        ? ''
        : styles.headerSSR}
        ${tempStickyStyles}
        ${tempStickyExpanded}`}
      style={totalHeaderHeight && !smallBreakpoint
        ? {
          ['height' as any]: isHovering
            ? `${totalHeaderHeight / fontSize}rem`
            : undefined,
        }
        : {}
      }
    >

      {smallBreakpoint &&
        <div data-header='focus-region' ref={focusRegionRef}>
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
            onPointerLeave={(e: React.PointerEvent) => {
              if (e.pointerType === 'mouse') {
                setIsHovering(false);
              }
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
