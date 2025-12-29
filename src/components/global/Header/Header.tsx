import 'server-only';
import React from 'react';
import {
  InterfaceHeaderMetaNavigation,
  InterfaceHeaderNavigation,
} from '@/payload-types';
import { HeaderComponent } from '@/components/global/Header/Header.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { ColorMode } from '@/components/base/types/colorMode';
import {
  extractLinkIds, generateLinkUrls,
} from '@/components/global/Header/generateUrls';
import { updateLinkReferences } from '@/components/global/Header/updateLinkReferences';

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
  headerDocumentId?: string;
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

  // Track link references
  if (props.headerDocumentId) {
    const linkIds = extractLinkIds({
      metanav: props.metanav,
      navigation: props.navigation,
      options: {
        includeMainNavItems: true,
      },
    });

    await updateLinkReferences({
      docId: props.headerDocumentId,
      linkIds: [...new Set(linkIds)],
    });
  }

  return (
    <HeaderComponent
      {...props}
      linkUrls={linkUrls}
    />
  );
};

