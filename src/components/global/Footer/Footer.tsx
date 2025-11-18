'use client';

import React, {
  useRef, useState,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/global/Footer/Footer.module.scss';

import {
  Config,
  InterfaceConsentOverlay,
  InterfaceFooterContact,
  InterfaceFooterLegal,
  InterfaceFooterSocialLinks,
  InterfaceHeaderMetaNavigation,
  InterfaceHeaderNavigation,
} from '@/payload-types';

import { FooterContact } from '@/components/base/FooterContact/FooterContact';
import {
  InterfaceNavigationPropTypes, Navigation,
} from '@/components/base/Navigation/Navigation';
import {
  InterfaceMetanavItem, InterfaceMetanavPropTypes, Metanav,
} from '@/components/base/Metanav/Metanav';
import { FooterLogo } from '@/components/base/FooterLogo/FooterLogo';
import {
  InterfaceSocialLinksPropTypes, SocialLinks,
} from '@/components/base/SocialLinks/SocialLinks';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { i18nA11y } from '@/i18n/content';
import { ConsentOverlay } from '../ConsentOverlay/ConsentOverlay';
import { useScrollLock } from '@/hooks/useScrollLock';
import { openConsentOverlayEventName } from '@/components/helpers/cookies';

export type InterfaceFooterPropTypes = {
  contact: InterfaceFooterContact;
  legal: InterfaceFooterLegal;
  metaNav: InterfaceHeaderMetaNavigation;
  navigation: InterfaceHeaderNavigation;
  socialLinks?: InterfaceFooterSocialLinks;
  structuredDataImage: string;
  structuredDataUrl: string;
  fg?: {
    sagwLink: string;
    sagwLinkText: string;
  }
  pageLanguage: Config['locale'];
  consentOverlay: InterfaceConsentOverlay;
};

export const Footer = ({
  contact,
  legal,
  metaNav,
  navigation,
  socialLinks,
  structuredDataImage,
  structuredDataUrl,
  fg,
  pageLanguage,
  consentOverlay,
}: InterfaceFooterPropTypes): React.JSX.Element => {
  const overlayDialogRef = useRef<HTMLDialogElement>(null);
  const [
    isOverlayOpen,
    setIsOverlayOpen,
  ] = useState(false);

  // Aggregate copyright text with copyright sign and current year
  const today = new Date();
  const copyrightText = rteToHtml(legal.copyright);
  const legalCopyrightText = `© ${copyrightText} ${today.getFullYear()}`;

  // scroll lock when overlay is open
  useScrollLock(isOverlayOpen);

  // Listen for event to open overlay from ConsentBanner
  React.useEffect(() => {
    const handleOpenOverlay = (): void => {
      overlayDialogRef.current?.showModal();
      setIsOverlayOpen(true);
    };

    window.addEventListener(openConsentOverlayEventName, handleOpenOverlay);

    return (): void => {
      window.removeEventListener(openConsentOverlayEventName, handleOpenOverlay);
    };
  }, []);

  const footerClasses = cva([styles.footer], {
    variants: {
      fg: {
        false: undefined,
        true: [styles.fg],
      },
    },
  });

  const contactProps = {
    address1: {
      plain: rte1ToPlaintext(contact.address1),
      rte: rteToHtml(contact.address1),
    },
    address2: {
      plain: rte1ToPlaintext(contact.address2),
      rte: rteToHtml(contact.address2),
    },
    city: rte1ToPlaintext(contact.city),
    countryCode: rte1ToPlaintext(contact.countryCode),
    imageUrl: structuredDataImage,

    mail: rte1ToPlaintext(contact.mail),
    phone: rte1ToPlaintext(contact.phone),
    poBox: rte1ToPlaintext(contact.poBox),
    title: {
      plain: rte1ToPlaintext(contact.title),
      rte: rteToHtml(contact.title),
    },
    url: structuredDataUrl,
    zip: rte1ToPlaintext(contact.zipCode),
  };

  const metanavProps: InterfaceMetanavPropTypes = {
    colorMode: 'dark',
    items: metaNav.metaLinks
      ? metaNav.metaLinks?.map((item) => {
        if (item.linkExternal) {
          const navItem: InterfaceMetanavItem = {
            link: item.linkExternal.externalLink || '',
            target: '_blank',
            text: rteToHtml(item.linkExternal.externalLinkText),
          };

          return navItem;
        }

        const navItem: InterfaceMetanavItem = {

          // TODO: generate url
          link: item.linkInternal?.internalLink.slug || '',
          target: '_blank',
          text: rteToHtml(item.linkInternal?.linkText),
        };

        return navItem;

      })
      : [],
    pageLanguage,
  };

  const legalProps: InterfaceMetanavPropTypes = {
    colorMode: 'dark',
    items: [
      {
        link: '',
        target: '_self',
        text: rteToHtml(legal.dataPrivacy),
      },
      {
        link: '',
        target: '_self',
        text: rteToHtml(legal.impressum),
      },
      {
        clickCallback: (): void => {
          overlayDialogRef.current?.showModal();
          setIsOverlayOpen(true);
        },
        text: rteToHtml(legal.cookieSettings),
      },
    ],
    pageLanguage,
  };

  const socialLinkProps: InterfaceSocialLinksPropTypes = {
    items: socialLinks?.items
      ? socialLinks.items?.map((item) => ({
        icon: item.icon,
        link: item.externalLink,
        text: i18nA11y.socialLinks[item.icon][pageLanguage],
      }))
      : [],
  };

  const navigationProps: InterfaceNavigationPropTypes = {
    colorMode: 'dark',
    footer: true,
    pageLanguage,
    sections: navigation.navItems
      .filter((navItem) => navItem.subNavItems && navItem.subNavItems.length > 0)
      .map((navItem, index) => ({
        colorMode: 'dark',
        expandableId: `expandable-id-${index}`,
        footer: true,
        items: navItem.subNavItems
          ? navItem.subNavItems.map((subnavItem) => ({
            colorMode: 'dark',
            footer: false,

            // TODO: generate url
            link: subnavItem.navItemLink?.slug || '',
            pageLanguage,
            text: rteToHtml(subnavItem.navItemText),
          }))
          : [],
        pageLanguage: undefined,
        setExpanded: undefined,
        text: rteToHtml(navItem.navItemText) || '',
      })),
  };

  const logoProps = {
    link: '',
    linkText: '',
  };

  if (fg) {
    logoProps.link = fg.sagwLink;
    logoProps.linkText = fg.sagwLinkText;
  }

  return (
    <footer
      className={footerClasses({
        fg: Boolean(fg),
      })}
    >
      <div className={styles.navWrapper}>
        <FooterContact
          {...contactProps}
          className={styles.contact}
        />

        <Navigation
          {...navigationProps}
          className={styles.navigation}
        />
      </div>

      <div className={styles.meta}>
        {fg &&
          <FooterLogo
            {...logoProps}
            className={styles.footerLogo}
          />
        }
        <Metanav
          {...legalProps}
          className={styles.legal}
        />
        <Metanav
          {...metanavProps}
          className={styles.metanav}
        />

        <SafeHtml
          as='p'
          className={styles.copyright}
          html={legalCopyrightText}
        />

        <SocialLinks
          {...socialLinkProps}
          className={styles.socialLinks}
        />

        <ConsentOverlay
          ref={overlayDialogRef}
          {...consentOverlay}
          pageLanguage={pageLanguage}
          onClose={(): void => {
            setIsOverlayOpen(false);
          }}
        />
      </div>

    </footer>
  );
};
