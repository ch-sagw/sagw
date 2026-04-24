import 'server-only';
import React from 'react';
import {
  InterfaceHeaderMetaNavigation,
  InterfaceHeaderNavigation,
} from '@/payload-types';
import styles from '@/components/global/Header/Header.module.scss';
import { HeaderComponent } from '@/components/global/Header/Header.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { ColorMode } from '@/components/base/types/colorMode';
import {
  generateLangNavUrls, generateLinkUrls,
} from '@/components/global/Header/generateUrls';
import { PageMainViewTransition } from '@/components/PageMainViewTransition';
export type InterfaceHeaderPropTypesCms = {
  metanav: InterfaceHeaderMetaNavigation;
  navigation: InterfaceHeaderNavigation;
}

export type InterfaceHeaderPropTypes = {
  colorMode: ColorMode;
  menuButton: {
    open: string,
    close: string,
  };
  logoLink: string;
  documentId?: string;
  tenant: string;
  tenantSlug?: string;
} & InterfaceHeaderPropTypesCms;

export const Header = async (props: InterfaceHeaderPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();

  const linkUrls = await generateLinkUrls({
    locale,
    metanav: props.metanav,
    navigation: props.navigation,
    options: {
      includeMainNavItems: true,
    },
    payload,
  });

  const localeUrls = await generateLangNavUrls({
    pageId: props.documentId || '',
    payload,
    tenantSlug: props.tenantSlug,
  });

  return (
    <PageMainViewTransition name='page-header'>
      <HeaderComponent
        {...props}
        linkUrls={linkUrls}
        localeUrls={localeUrls}
      />
      <div
        className={styles.headerBg}
        data-optimistic-nav-fade
      ></div>
    </PageMainViewTransition>
  );
};

