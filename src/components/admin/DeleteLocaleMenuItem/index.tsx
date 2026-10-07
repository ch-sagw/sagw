'use client';

import {
  ConfirmationModal,
  PopupList,
  toast,
  useConfig,
  useDocumentInfo,
  useForm,
  useFormFields,
  useLocale,
  useModal,
  useRouteTransition,
  useTranslation,
} from '@payloadcms/ui';
import { getTranslation } from '@payloadcms/translations';
import { formatAdminURL } from 'payload/shared';
import { useRouter } from 'next/navigation';
import type { EditMenuItemsClientProps } from 'payload';
import React, {
  useCallback, useMemo,
} from 'react';
import type {
  AdminTranslationsKeys, AdminTranslationsObject,
} from '@/i18n/adminTranslations';

export const deleteLocaleMenuItemButtonId = 'delete-locale-variant__button';

// Edit view 3-dot menu entry "Löschen (Sprachvariante)". Permanently removes
// the current (non-default) locale from the document via the
// `/:id/delete-locale` collection endpoint.
export const DeleteLocaleMenuItem: React.FunctionComponent<EditMenuItemsClientProps> = () => {
  const {
    collectionSlug,
    hasDeletePermission,
    id,
  } = useDocumentInfo();

  const {
    config: {
      localization,
      routes: {
        admin: adminRoute,
        api: apiRoute,
      },
    },
  } = useConfig();

  const {
    i18n,
    t,
  } = useTranslation<AdminTranslationsObject, AdminTranslationsKeys>();

  const {
    setModified,
  } = useForm();

  const {
    openModal,
  } = useModal();

  const {
    startRouteTransition,
  } = useRouteTransition();

  const router = useRouter();
  const localeState = useLocale();

  // The edit view loads the document without locale fallback, so an empty
  // (required, localized) slug means there is no variant in this locale.
  const slugValue = useFormFields(([fields]) => fields.slug?.value) as unknown;

  const localeCode = useMemo((): string | undefined => {
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

  const localeLabel = useMemo((): string => {
    if (!localization || !localeCode) {
      return localeCode ?? '';
    }

    const localeConfig = localization.locales.find((locale) => locale.code === localeCode);

    if (!localeConfig) {
      return localeCode;
    }

    return getTranslation(localeConfig.label, i18n) || localeCode;
  }, [
    i18n,
    localeCode,
    localization,
  ]);

  const isDefaultLocale = Boolean(localization && localeCode && localization.defaultLocale === localeCode);

  const hasVariant = typeof slugValue === 'string' && slugValue.length > 0;

  const modalSlug = `delete-locale-variant-${String(id)}-${localeCode ?? ''}`;

  const handleConfirm = useCallback(async (): Promise<void> => {
    if (!collectionSlug || id === undefined || id === null || !localeCode) {
      return;
    }

    try {
      const url = formatAdminURL({
        apiRoute,
        path: `/${collectionSlug}/${String(id)}/delete-locale`,
      });

      const response = await fetch(url, {
        body: JSON.stringify({
          locale: localeCode,
        }),
        credentials: 'include',
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const json = await response.json()
        .catch(() => ({}));

      if (response.status >= 400) {
        const errors: { message?: string }[] | undefined = json?.errors;

        if (errors && errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error.message || t('custom:deleteLocaleVariantError'));
          });
        } else {
          toast.error(t('custom:deleteLocaleVariantError'));
        }

        return;
      }

      // The document changed outside of the form; drop the dirty flag so the
      // navigation below is not blocked by the "unsaved changes" prompt.
      setModified(false);

      toast.success(t('custom:deleteLocaleVariantSuccess', {
        language: localeLabel,
      }));

      startRouteTransition(() => {
        router.push(`${formatAdminURL({
          adminRoute,
          path: `/collections/${collectionSlug}/${String(id)}`,
        })}?locale=${localeCode}`);
        router.refresh();
      });
    } catch {
      toast.error(t('custom:deleteLocaleVariantError'));
    }
  }, [
    adminRoute,
    apiRoute,
    collectionSlug,
    i18n.language,
    id,
    localeCode,
    localeLabel,
    router,
    setModified,
    startRouteTransition,
    t,
  ]);

  if (
    !collectionSlug ||
    id === undefined ||
    id === null ||
    !localeCode ||
    !localization ||
    isDefaultLocale ||
    !hasDeletePermission ||
    !hasVariant
  ) {
    return null;
  }

  return (
    <React.Fragment>
      <PopupList.Button
        id={deleteLocaleMenuItemButtonId}
        onClick={() => {
          openModal(modalSlug);
        }}
      >
        {t('custom:deleteLocaleVariant')}
      </PopupList.Button>
      <ConfirmationModal
        body={t('custom:deleteLocaleVariantBody', {
          language: localeLabel,
        })}
        confirmingLabel={t('custom:deleteLocaleVariantConfirming')}
        heading={t('custom:deleteLocaleVariantHeading')}
        modalSlug={modalSlug}
        onConfirm={handleConfirm}
      />
    </React.Fragment>
  );
};

export default DeleteLocaleMenuItem;
