export const userRoles = {
  admin: 'super-admin',
  user: 'global-user',
} as const;

export const tenantRoles = {
  admin: 'tenant-admin',
  editor: 'editor',
  editorMagazine: 'editor-magazine',
  translator: 'translator',
} as const;
