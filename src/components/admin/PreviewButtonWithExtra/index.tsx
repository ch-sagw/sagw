'use client';

import {
  Button,
  ExternalLinkIcon,
  useDocumentInfo,
  useLivePreviewContext,
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

export const PreviewButtonWithExtra: React.FunctionComponent<
  PreviewButtonClientProps
> = () => {

  const {
    hasPublishedDoc,
    isInitializing,
    collectionSlug,
    id,
    unpublishedVersionCount,
  } = useDocumentInfo();

  const {
    previewURL,
  } = useLivePreviewContext();

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

  const hasDraftToPreview =
    !hasPublishedDoc ||
    unpublishedVersionCount > 0;

  const publishedDisabled = Boolean(isInitializing ||
    !canOpenPublished ||
    !hasPublishedDoc);

  const draftDisabled = Boolean(isInitializing ||
    !hasDraftToPreview);

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
    <div
      className='preview-btn-with-extra'
      data-testid='preview-buttons'
    >
      {previewURL
        ? (
          <Button
            buttonStyle='secondary'
            disabled={draftDisabled}
            el='anchor'
            icon={
              <ExternalLinkIcon />
            }
            iconPosition='left'
            id='preview-button'
            newTab
            size='small'
            tooltip={draftDisabled
              ? 'No draft to preview'
              : 'Draft'}
            url={previewURL}
          >
            Draft
          </Button>
        )
        : null}
      <Button
        aria-label='Open published site in new tab'
        buttonStyle='secondary'
        disabled={publishedDisabled}
        icon={
          <ExternalLinkIcon />
        }
        iconPosition='left'
        id='page-edit-open-published-site'
        onClick={openPublishedSite}
        size='small'
        tooltip={publishedDisabled
          ? 'Not published'
          : 'Published'}
        type='button'
      >
        Published
      </Button>
    </div>
  );
};

export default PreviewButtonWithExtra;
