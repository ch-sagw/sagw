// Extracts tenant ID from a document or request user
export const getTenantFromDocument = (document: Record<string, unknown> | null | undefined): string | null | undefined => {
  if (document && typeof document === 'object' && 'tenant' in document) {
    const {
      tenant,
    } = document;

    if (typeof tenant === 'string') {
      return tenant;
    }
  }

  return null;
};

