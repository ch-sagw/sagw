import {
  getRequestedTenant,
  hasEditorialTenantAssignment,
  isMagazineEditor, isSagwTenant, isSuperAdmin, isTenantAdmin,
  isTranslator,
  tenantRoles,
} from '@/collections/Plc/Users/roles';
import {
  AccessArgs,
  AccessResult,
} from 'payload';
import type { User } from '@/payload-types';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';

// ########################################################################
// Create access
// ########################################################################

// -> Only super-admin, sagw-admin, fg-admin and magazine editors can create
const accessGenericCreate = ({
  req,
}: AccessArgs): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

// -> Only super-admin, sagw-admin and magazine editor can create
const accessSagwOnlyCreate = async ({
  req,
}: AccessArgs): Promise<AccessResult> => {
  if (isSuperAdmin(req) || isMagazineEditor(req)) {
    return true;
  }

  const sagwTenant = await isSagwTenant(req);

  return isTenantAdmin(req) && sagwTenant;
};

// ########################################################################
// Read access
// ########################################################################

// -> Editor users get full read so admin internals (stale-doc check,
// draft findByID) match the edit view. This fixes an issue where a "stale data"
// payload-pop up appeared after editing a draft-document (it misleadedly noted
// another being editing the same document).
const accessGenericRead = ({
  req,
}: AccessArgs): AccessResult => {
  if (
    isSuperAdmin(req) ||
    isTenantAdmin(req) ||
    isMagazineEditor(req) ||
    isTranslator(req) ||
    hasEditorialTenantAssignment(req)
  ) {
    return true;
  }

  // for all other users, we want to give read access only if the document
  // is published

  return {
    /* eslint-disable @typescript-eslint/naming-convention */
    _status: {
      equals: 'published',
    },
    /* eslint-enable @typescript-eslint/naming-convention */
  };
};

const accessSagwOnlyRead = async ({
  req,
}: AccessArgs): Promise<AccessResult> => {
  if (isSuperAdmin(req) || isMagazineEditor(req) || isTranslator(req)) {
    return true;
  }

  const sagwTenant = await isSagwTenant(req);

  if (isTenantAdmin(req) && sagwTenant) {
    return true;
  }

  // Same pattern as accessGenericRead / roles.ts: admin server functions (e.g.
  // copy locale) may run without tenant cookie context; tenant-scoped checks
  // above would fail even though the user is an editorial user.
  if (!getRequestedTenant(req) && hasEditorialTenantAssignment(req)) {
    return true;
  }

  return false;
};

// ########################################################################
// Update access
// ########################################################################

// -> all authenticated users (except translators) can update and publish
// -> translators can update and save-draft only
const accessGenericUpdate = ({
  req,
}: AccessArgs): AccessResult => {
  if (isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req)) {
    return true;
  }

  if (isTranslator(req)) {
    // only allow saving drafts, but don't allow publishing a page
    if (req.data?._status === 'published') {
      return false;
    }

    return true;
  }

  return false;

};

// -> super-admin can update
// -> tenant-admin and magazine-editor can only update if tenant is sagw
// -> translators can update and save-draft only
const accessSagwOnlyUpdate = async ({
  req,
}: AccessArgs): Promise<AccessResult> => {
  if (isSuperAdmin(req)) {
    return true;
  }

  if (isMagazineEditor(req) || isTenantAdmin(req)) {
    const sagwTenant = await isSagwTenant(req);

    return sagwTenant;
  }

  if (isTranslator(req)) {
    // only allow saving drafts, but don't allow publishing a page
    if (req.data?._status === 'published') {
      return false;
    }

    return true;
  }

  if (!getRequestedTenant(req) && hasEditorialTenantAssignment(req)) {
    const translatorOnJwt =
      getUserTenantIDs(req.user as User, tenantRoles.translator).length > 0;

    if (translatorOnJwt && req.data?._status === 'published') {
      return false;
    }

    return true;
  }

  return false;

};

// ########################################################################
// Delete access
// ########################################################################

// -> Only super-admin, sagw-admin and fg-admin can delete
const accessGenericDelete = ({
  req,
}: AccessArgs): AccessResult => isSuperAdmin(req) || isTenantAdmin(req);

// -> Only super-admin, sagw-admin and magazine editor can delete
const accessSagwOnlyDelete = accessSagwOnlyCreate;

const accessMagazineDetailPageDelete = ({
  req,
}: AccessArgs): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

// ########################################################################
// Page Access Models
// ########################################################################

// Generic pages
export const pageAccess = {
  create: accessGenericCreate,
  delete: accessGenericDelete,
  read: accessGenericRead,
  update: accessGenericUpdate,
};

// Magazine Detail pages
export const pageAccessMagazineDetail = {
  create: accessGenericCreate,
  delete: accessMagazineDetailPageDelete,
  read: accessGenericRead,
  update: accessGenericUpdate,
};

// National Dictionary Detail pages
export const pageAccessNationalDictionary = {
  create: accessSagwOnlyCreate,
  delete: accessSagwOnlyDelete,
  read: accessSagwOnlyRead,
  update: accessSagwOnlyUpdate,
};

// Institute Detail pages
export const pageAccessInstituteDetail = {
  create: accessSagwOnlyCreate,
  delete: accessSagwOnlyDelete,
  read: accessSagwOnlyRead,
  update: accessSagwOnlyUpdate,
};
