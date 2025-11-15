import {
  isMagazineEditor, isSuperAdmin, isTenantAdmin,
  isTranslator,
} from '@/collections/Plc/Users/roles';
import {
  AccessResult, PayloadRequest,
} from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
}

const accessPageCreate = ({
  req,
}: InterfaceAccessParam): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

const accessPageRead = ({
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

const accessPageUpdate = ({
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

const accessPageDelete = ({
  req,
}: InterfaceAccessParam): AccessResult => isSuperAdmin(req) || isTenantAdmin(req);

export const pageAccess = {
  create: accessPageCreate,
  delete: accessPageDelete,
  read: accessPageRead,
  update: accessPageUpdate,
};
