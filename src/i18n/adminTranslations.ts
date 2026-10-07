import type { NestedKeysStripped } from '@payloadcms/translations';

// Custom admin UI translations. Payload exposes them as `custom:<key>`
// through `useTranslation()` / `req.t()`.
export const adminTranslations = {
  de: {
    custom: {
      deleteLocaleVariant: 'Löschen (Sprachvariante)',
      deleteLocaleVariantBody: 'Sie sind dabei, die Sprachvariante «{{language}}» dieser Seite endgültig zu löschen. Alle Inhalte in dieser Sprache werden aus der Seite und aus allen gespeicherten Versionen entfernt. Die Seite ist danach in dieser Sprache nicht mehr erreichbar. Dieser Vorgang kann nicht rückgängig gemacht werden.',
      deleteLocaleVariantConfirming: 'Wird gelöscht...',
      deleteLocaleVariantError: 'Die Sprachvariante konnte nicht gelöscht werden.',
      deleteLocaleVariantHeading: 'Sprachvariante löschen',
      deleteLocaleVariantSuccess: 'Die Sprachvariante «{{language}}» wurde gelöscht.',
    },
  },
  en: {
    custom: {
      deleteLocaleVariant: 'Delete (language variant)',
      deleteLocaleVariantBody: 'You are about to permanently delete the “{{language}}” language variant of this page. All content in this language will be removed from the page and from all stored versions. The page will no longer be reachable in this language. This cannot be undone.',
      deleteLocaleVariantConfirming: 'Deleting...',
      deleteLocaleVariantError: 'The language variant could not be deleted.',
      deleteLocaleVariantHeading: 'Delete language variant',
      deleteLocaleVariantSuccess: 'The “{{language}}” language variant has been deleted.',
    },
  },
  fr: {
    custom: {
      deleteLocaleVariant: 'Supprimer (variante linguistique)',
      deleteLocaleVariantBody: 'Vous êtes sur le point de supprimer définitivement la variante linguistique « {{language}} » de cette page. Tous les contenus dans cette langue seront retirés de la page et de toutes les versions enregistrées. La page ne sera plus accessible dans cette langue. Cette action est irréversible.',
      deleteLocaleVariantConfirming: 'Suppression en cours...',
      deleteLocaleVariantError: 'La variante linguistique n’a pas pu être supprimée.',
      deleteLocaleVariantHeading: 'Supprimer la variante linguistique',
      deleteLocaleVariantSuccess: 'La variante linguistique « {{language}} » a été supprimée.',
    },
  },
};

export type AdminTranslationsObject = typeof adminTranslations.de;
export type AdminTranslationsKeys = NestedKeysStripped<AdminTranslationsObject>;
