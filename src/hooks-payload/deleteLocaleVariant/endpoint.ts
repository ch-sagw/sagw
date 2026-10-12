import {
  addDataAndFileToRequest,
  APIError,
  type CollectionSlug,
  commitTransaction,
  type Endpoint,
  initTransaction,
  killTransaction,
  type PayloadRequest,
  type SanitizedCollectionConfig,
  type Where,
} from 'payload';
import { deleteLocaleFromDocument } from '@/hooks-payload/deleteLocaleVariant/deleteLocaleFromDocument';
import { deleteLocaleEndpointPath } from '@/hooks-payload/deleteLocaleVariant/constants';
import { invalidateCache } from '@/utilities/invalidateCache';
import { extractID } from '@/utilities/extractId';
import type { Tenant } from '@/payload-types';

const getLocaleCodesFromConfig = (req: PayloadRequest): string[] => {
  const {
    localization,
  } = req.payload.config;

  if (!localization) {
    return [];
  }

  return localization.localeCodes;
};

// Resolves delete access the same way Payload does for the built-in delete:
// boolean -> allow/deny; Where -> the document must match the constraint.
const hasDeleteAccess = async ({
  collectionConfig,
  id,
  req,
}: {
  collectionConfig: SanitizedCollectionConfig;
  id: string;
  req: PayloadRequest;
}): Promise<boolean> => {
  const accessFn = collectionConfig.access?.delete;

  if (!accessFn) {
    // Payload default: any authenticated user
    return Boolean(req.user);
  }

  const result = await accessFn({
    id,
    req,
  });

  if (typeof result === 'boolean') {
    return result;
  }

  const where: Where = {
    and: [
      {
        id: {
          equals: id,
        },
      },
      result,
    ],
  };

  const {
    totalDocs,
  } = await req.payload.count({
    collection: collectionConfig.slug as CollectionSlug,
    req,
    where,
  });

  return totalDocs > 0;
};

// POST /api/<collection>/:id/delete-locale  { locale: 'fr' }
//
// Permanently removes one (non-default) language variant from a page:
// content in that locale is stripped from the document and from all of
// its versions. Without a slug in that locale the page is no longer
// resolvable under its URL in that language.
export const deleteLocaleEndpoint: Endpoint = {
  handler: async (req) => {
    if (!req.user) {
      throw new APIError('Unauthorized', 401);
    }

    const collectionSlug = req.routeParams?.collection;
    const id = req.routeParams?.id;

    if (typeof collectionSlug !== 'string' || typeof id !== 'string' || !id) {
      throw new APIError('Missing collection or id', 400);
    }

    const collectionConfig = req.payload.collections[collectionSlug as CollectionSlug]?.config;

    if (!collectionConfig) {
      throw new APIError('Unknown collection', 404);
    }

    await addDataAndFileToRequest(req);

    const requestedLocale = req.data?.locale;
    const localeCodes = getLocaleCodesFromConfig(req);
    const defaultLocale = req.payload.config.localization
      ? req.payload.config.localization.defaultLocale
      : undefined;

    if (typeof requestedLocale !== 'string' || !localeCodes.includes(requestedLocale)) {
      throw new APIError('Unknown locale', 400);
    }

    if (requestedLocale === defaultLocale) {
      throw new APIError('The default locale cannot be deleted. Delete the whole page instead.', 400);
    }

    // Load the document (all locales, without access control) so we can
    // resolve its tenant for the role / language checks below.
    const doc = await req.payload.findByID({
      collection: collectionSlug as CollectionSlug,
      depth: 0,
      disableErrors: true,
      id,
      locale: 'all',
      overrideAccess: true,
      req,
    }) as Record<string, unknown> | null;

    if (!doc) {
      throw new APIError('Document not found', 404);
    }

    const tenantId = doc.tenant
      ? extractID(doc.tenant as Tenant | string)
      : null;

    // Make the document's tenant available to the role helpers
    // (getRequestedTenant reads req.data.tenant first).
    if (tenantId) {
      req.data = {
        ...req.data,
        tenant: tenantId,
      };
    }

    const allowed = await hasDeleteAccess({
      collectionConfig,
      id,
      req,
    });

    if (!allowed) {
      throw new APIError('You are not allowed to delete this page.', 403);
    }

    // The locale must be enabled for the tenant
    if (tenantId) {
      const tenant = await req.payload.findByID({
        collection: 'tenants',
        depth: 0,
        disableErrors: true,
        id: tenantId,
        overrideAccess: true,
        req,
      });

      const tenantLanguages = tenant?.languages as Record<string, boolean | null | undefined> | null | undefined;

      if (tenantLanguages && !tenantLanguages[requestedLocale]) {
        throw new APIError('This language is not enabled for the tenant.', 400);
      }
    }

    const shouldCommit = await initTransaction(req);

    let result;

    try {
      result = await deleteLocaleFromDocument({
        collectionConfig,
        id,
        locale: requestedLocale,
        req,
      });

      if (shouldCommit) {
        await commitTransaction(req);
      }
    } catch (error) {
      await killTransaction(req);

      throw error;
    }

    // Writes bypassed collection hooks, so invalidate the tenant cache here.
    await invalidateCache({
      includeDrafts: true,
      logCacheInvalidation: req.context?.logCacheInvalidation === true,
      payload: req.payload,
      tenantId,
    });

    return Response.json({
      id,
      locale: requestedLocale,
      versionsUpdated: result.versionsUpdated,
    });
  },
  method: 'post',
  path: deleteLocaleEndpointPath,
};
