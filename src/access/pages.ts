import {
  isMagazineEditor, isSagwTenant, isSuperAdmin, isTenantAdmin,
  isTranslator,
} from '@/collections/Plc/Users/roles';
import {
  AccessResult, PayloadRequest,
} from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
}

// ########################################################################
// Create access
// ########################################################################

// -> Only super-admin, sagw-admin, fg-admin and magazine editors can create
const accessGenericCreate = ({
  req,
}: InterfaceAccessParam): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

// -> Only super-admin, sagw-admin and magazine editor can create
const accessSagwOnlyCreate = async ({
  req,
}: InterfaceAccessParam): Promise<AccessResult> => {
  if (isSuperAdmin(req) || isMagazineEditor(req)) {
    return true;
  }

  const sagwTenant = await isSagwTenant(req);

  return isTenantAdmin(req) && sagwTenant;
};

// ########################################################################
// Read access
// ########################################################################

// -> all authenticated users can read.
// -> non-authenticated users can only read published documents.
const accessGenericRead = ({
  req,
}: InterfaceAccessParam): AccessResult => {
  if (isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req) || isTranslator(req)) {
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
}: InterfaceAccessParam): Promise<AccessResult> => {
  if (isSuperAdmin(req) || isMagazineEditor(req) || isTranslator(req)) {
    return true;
  }

  const sagwTenant = await isSagwTenant(req);

  return isTenantAdmin(req) && sagwTenant;
};

// ########################################################################
// Update access
// ########################################################################

// -> all authenticated users (except translators) can update and publish
// -> translators can update and save-draft only
const accessGenericUpdate = ({
  req,
}: InterfaceAccessParam): AccessResult => {
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
}: InterfaceAccessParam): Promise<AccessResult> => {
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

  return false;

};

// ########################################################################
// Delete access
// ########################################################################

// -> Only super-admin, sagw-admin and fg-admin can delete
const accessGenericDelete = ({
  req,
}: InterfaceAccessParam): AccessResult => isSuperAdmin(req) || isTenantAdmin(req);

// -> Only super-admin, sagw-admin and magazine editor can delete
const accessSagwOnlyDelete = accessSagwOnlyCreate;

const accessMagazineDetailPageDelete = ({
  req,
}: InterfaceAccessParam): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

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
