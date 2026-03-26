import {
  getRequestedTenant, isMagazineEditor, isSuperAdmin, isTenantAdmin, isTranslator, tenantRoles, userRoles,
} from '@/collections/Plc/Users/roles';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import type { User } from '@/payload-types';
import { PayloadRequest } from 'payload';

interface InterfaceAccessParam {
  data?: unknown;
  doc?: unknown;
  req: PayloadRequest;
}

const extractTenantID = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  if ('tenant' in value && value.tenant) {
    if (typeof value.tenant === 'string') {
      return value.tenant;
    }

    if (typeof value.tenant === 'object' && 'id' in value.tenant && value.tenant.id) {
      return String(value.tenant.id);
    }
  }

  return undefined;
};

const hasMetaRoleOnDocumentTenant = ({
  data,
  doc,
  req,
}: InterfaceAccessParam): boolean => {
  if (!req.user || !req.user.roles?.includes(userRoles.user)) {
    return false;
  }

  const requestedTenant = extractTenantID(data) || extractTenantID(doc) || getRequestedTenant(req);

  if (!requestedTenant) {
    return false;
  }

  return [
    tenantRoles.admin,
    tenantRoles.editorMagazine,
    tenantRoles.translator,
  ].some((role) => getUserTenantIDs(req.user as User, role as NonNullable<User['tenants']>[number]['roles'][number])
    .includes(requestedTenant));
};

const accessFieldMeta = (args: InterfaceAccessParam): boolean => {
  const {
    req,
  } = args;

  return isSuperAdmin(req) ||
    isTenantAdmin(req) ||
    isMagazineEditor(req) ||
    isTranslator(req) ||
    hasMetaRoleOnDocumentTenant(args);
};

export const fieldAccessMeta = {
  create: accessFieldMeta,
  read: accessFieldMeta,
  update: accessFieldMeta,
};
