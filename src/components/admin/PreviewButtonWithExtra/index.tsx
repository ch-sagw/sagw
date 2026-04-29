'use client';

import {
  Button,
  LinkIcon,
  PreviewButton,
  useDocumentInfo,
  useLocale,
} from '@payloadcms/ui';

import type { PreviewButtonClientProps } from 'payload';
import React, {
  useCallback,
  useMemo,
} from 'react';

import './styles.scss';

import type { Config } from '@/payload-types';

const openPublishedHref = ({
  collection,
  id,
  locale,
}: {
  collection: string;
  id: number | string;
  locale: Config['locale'];
}): string => {
  const params = new URLSearchParams({
    collection,
    id: String(id),
    locale,
  });

  return `/open-published?${params.toString()}`;
};

const PreviewButtonWithExtra = (props: PreviewButtonClientProps): React.ReactElement => {
  const {
    isInitializing,
    collectionSlug,
    id,
  } = useDocumentInfo();

  const localeState = useLocale();

  const localeCode = useMemo(() => {
    if (
      typeof localeState === 'object' &&
      localeState !== null &&
      'code' in localeState &&
      typeof localeState.code === 'string'
    ) {
      return localeState.code;
    }

    return undefined;
  }, [localeState]);

  const activeLocale = useMemo((): Config['locale'] => {
    if (!localeCode) {
      return 'de';
    }

    const [short] = localeCode.split('-');

    const allowed: readonly Config['locale'][] = [
      'de',
      'en',
      'fr',
      'it',
    ];

    if (allowed.includes(short as Config['locale'])) {
      return short as Config['locale'];
    }

    return 'de';
  }, [localeCode]);

  const canOpenPublished = Boolean(collectionSlug &&
    id !== undefined &&
    id !== null &&
    localeCode);

  const openPublishedSite = useCallback(() => {
    if (
      !collectionSlug ||
      id === undefined ||
      id === null
    ) {
      return;
    }

    const href = openPublishedHref({
      collection: collectionSlug,
      id,
      locale: activeLocale,
    });

    window.open(
      href,
      '_blank',
      'noopener,noreferrer',
    );
  }, [
    activeLocale,
    collectionSlug,
    id,
  ]);

  return (
    <div className='preview-btn-with-extra'>
      <PreviewButton {...props} />
      <Button
        aria-label='Open published site in new tab'
        buttonStyle='secondary'
        disabled={Boolean(isInitializing) || !canOpenPublished}
        icon={
          <LinkIcon />
        }
        id='page-edit-open-published-site'
        onClick={openPublishedSite}
        size='small'
        tooltip='Open published live site (Draft Mode exits, correct URL)'
        type='button'
      />
    </div>
  );
};

export default PreviewButtonWithExtra;
